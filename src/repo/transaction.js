const response = require("../helpers/response");
const {
  success,
  notFound,
  systemError,
  created,
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
      } = body;
      client.query("BEGIN", (err) => {
        if (shouldAbort(err)) return;
        const transaction_id = order_id;
        const queryTransaction = `insert into transaction (id,user_id,movie_id,payment_id,ticket_count,total_price) values ($1,$2,$3,$4,$5,$6)`;
        const valuesTransaction = [
          transaction_id,
          user_id,
          movie_id,
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
                  [resStt.rows[0].id, transaction_id, today],
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
      "update transaction set status_payment = $1, status = $2,payment_id = $3 where id = $4";
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
    const query = `select t.id, m."name", s."name" as studio, u.firstname, u.lastname, t.status, TO_CHAR(t.created_at, 'DD/MM/YYYY HH24:MI') from transaction t
    left join movies m on t.movie_id = m.id
    full outer join seat_transaction_pivot stp on t.id = stp.transaction_id 
    full outer join seat_studio_times sst on stp.sst_id = sst.id 
    full outer join times_studio_movies tsm on sst.tsm_id = tsm.id 
    join studios s on tsm.studios_id = s.id
    join users u on t.user_id = u.id 
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

// const getTicketDetail = ()

// const getSeat = ()

const transactionRepo = {
  createTransaction,
  getHistory,
  updatePayment,
};

module.exports = transactionRepo;
