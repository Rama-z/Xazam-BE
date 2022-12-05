const response = require("../helpers/response");
const {
  success,
  notFound,
  systemError,
  created,
  forbiddenAccess,
} = require("../helpers/templateResponse");
const db = require("../config/database");

const createTransaction = (body) => {
  return new Promise((resolve, reject) => {
    db.connect((err, client, done) => {
      const shouldAbort = (err) => {
        if (err) {
          console.error("Error in Created", err.stack);
          resolve(invalidParameter());
          client.query("ROLLBACK", (err) => {
            if (err) {
              console.log(systemError(err.stack));
              resolve(systemError(err.stack));
            }
            done();
          });
        }
        return !!err;
      };
      const {
        user_id,
        movie_id,
        payment_id,
        ticket_count,
        total_price,
        seat_id,
        tsm_id,
        order_id,
        date_watch,
      } = body;
      client.query("BEGIN", (err) => {
        if (shouldAbort(err)) return;
        const transaction_id = order_id;
        const queryTransaction = `insert into transaction (id,user_id,payment_id,ticket_count,total_price) values ($1,$2,$3,$4,$5)`;
        const valuesTransaction = [
          transaction_id,
          user_id,
          payment_id,
          ticket_count,
          total_price,
        ];
        let count = 0;
        client.query(
          queryTransaction,
          valuesTransaction,
          (err, resTransaction) => {
            if (shouldAbort(err)) return;
            const queryStt = `insert into seat_studio_times(seat_id, tsm_id) values ($1,$2) RETURNING id`;
            seat_id.split(",").forEach((dataSeat) => {
              client.query(queryStt, [dataSeat, tsm_id], (err, resStt) => {
                if (shouldAbort(err)) return;
                let today = new Date();
                let dd = String(today.getDate()).padStart(2, "0");
                let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
                let yyyy = today.getFullYear();
                // today = yyyy + "/" + mm + "/" + dd;
                today = yyyy + "-" + mm + "-" + dd;
                const queryStp = `insert into seat_transaction_pivot(sst_id,transaction_id,date) values ($1,$2,$3)`;
                client.query(
                  queryStp,
                  [resStt.rows[0].id, transaction_id, date_watch],
                  (err, resStp) => {
                    if (shouldAbort(err)) return;
                    count += 1;
                    const arraySeat = seat_id.split(",");
                    if (count === arraySeat.length) {
                      client.query("COMMIT", (err) => {
                        if (err) {
                          console.error(
                            "Error committing transaction",
                            err.stack
                          );
                          resolve(systemError());
                        }
                        resolve(created({ transaction_id: transaction_id }));
                        done();
                      });
                    }
                  }
                );
              });
            });
          }
        );
      });
    });
  });
};

const updatePayment = (status_order, status, payment_id, ts_id) => {
  return new Promise((resolve, reject) => {
    let query =
      "update transaction set status_payment = $1, status = $2,payment_id = $3 where payment_id = $4";
    db.query(
      query,
      [status_order, status, payment_id, ts_id],
      (error, result) => {
        if (error) {
          console.log(error);
          return resolve(systemError());
        }
        resolve(success());
      }
    );
  });
};

const getHistory = (queryParams, user_id) => {
  return new Promise((resolve) => {
    const { search, filter, sort } = queryParams;
    const query = `select distinct on (t.id ) t.id, m."name", s."name" as studio,s.image as image_studio, u.firstname, u.lastname, t.status, TO_CHAR(stp."date", 'DD/MM/YYYY')date_transaction, TO_CHAR(t2."times" , 'HH24:MI') as time_transaction from transaction t
    full outer join seat_transaction_pivot stp on t.id = stp.transaction_id 
    full outer join seat_studio_times sst on stp.sst_id = sst.id 
    join times_studio_movies tsm on sst.tsm_id  = tsm.id 
    join movies_studio ms on tsm.movies_studios_id = ms.id 
    join movies m on ms.movie_id = m.id
    join studios s on ms.studio_id = s.id
    join users u on t.user_id = u.id 
    join times t2 on tsm.times_id = t2.id 
    where t.user_id = $1`;
    db.query(query, [user_id], (err, result) => {
      if (err) {
        console.log(err.message);
        resolve(systemError());
      }
      if (result?.rowCount === 0) return resolve(notFound());
      resolve(success(result.rows));
    });
  });
};

const getTicketDetail = (transaction_id, users_id) => {
  return new Promise((resolve) => {
    let query = `select distinct on (t.id ) t.id, t.user_id, m."name" as title_movie, s."name" as studio,s.image as image_studio, t.ticket_count,string_agg(distinct (s2.seat) , ', ')seats, t.total_price as price ,TO_CHAR(stp."date" , 'DD') as date,TO_CHAR(stp."date" , 'MM') as month,TO_CHAR(t2."times" , 'HH24:MI') as time from transaction t
    full outer join seat_transaction_pivot stp on t.id = stp.transaction_id 
    full outer join seat_studio_times sst on stp.sst_id = sst.id 
    join times_studio_movies tsm on sst.tsm_id  = tsm.id 
    join movies_studio ms on tsm.movies_studios_id = ms.id 
    join movies m on ms.movie_id = m.id
    join studios s on ms.studio_id = s.id
    join seat s2 on sst.seat_id = s2.id
    join users u on t.user_id = u.id
    join times t2 on tsm.times_id = t2.id 
    where t.id = $1
    group by t.id, t.user_id, title_movie, studio, image_studio,t.ticket_count, price, stp."date" , t2."times" `;
    db.query(query, [transaction_id], (err, results) => {
      if (err) {
        console.log(err.message);
        resolve(systemError());
      }
      if (results.rows[0].user_id !== users_id) resolve(forbiddenAccess());
      resolve(success(results.rows[0]));
    });
  });
};

const getallSeat = () => {
  return new Promise((resolve) => {
    let query = `select id, seat from seat`;
    db.query(query, (err, resSeat) => {
      if (err) {
        console.log(err.message);
        resolve(systemError());
      }
      resolve(success(resSeat.rows));
    });
  });
};

const getSelectSeat = () => {
  return new Promise((resolve) => {
    let query = `select s.id, s.seat from seat s 
    left join seat_studio_times sst on s.id = sst.seat_id 
    join seat_transaction_pivot stp on sst.id = stp.sst_id 
    where stp."date" = $1
    group by s.id, s.seat`;
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    let yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    db.query(query, [today], (err, restSelect) => {
      if (err) {
        console.log(err.message);
        resolve(systemError());
      }
      resolve(success(restSelect.rows));
    });
  });
};

const transactionRepo = {
  createTransaction,
  getHistory,
  updatePayment,
  getallSeat,
  getSelectSeat,
  getTicketDetail,
};

module.exports = transactionRepo;
