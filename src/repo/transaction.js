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
      } = body;
      client.query("BEGIN", (err) => {
        if (shouldAbort(err)) return;
        const queryTransaction = `insert into transaction (user_id,movie_id,payment_id,ticket_count,total_price) values ($1,$2,$3,$4,$5) RETURNING id`;
        const valuesTransaction = [
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
            const transaction_id = resTransaction.rows[0].id;
            const queryStt = `insert into seat_studio_times(seat_id, tsm_id) values ($1,$2) RETURNING id`;
            seat_id.split(",").forEach((dataSeat) => {
              client.query(queryStt, [dataSeat, tsm_id], (err, resStt) => {
                if (shouldAbort(err)) return;
                const queryStp = `insert into seat_transaction_pivot(sst_id,transaction_id) values ($1,$2)`;
                client.query(
                  queryStp,
                  [resStt.rows[0].id, transaction_id],
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

const getHistory = (queryParams) => {
  return new Promise((resolve) => {
    const { search, filter, sort } = queryParams;
    const query = `select t.id, m."name", m.synopsis, s."name", u.firstname, u.lastname, u.image, t.status from transactions t
    join movies m on lower(m.id) like lower(t.movie_id) 
    join studios s on s.id = t.studio_id 
    join users u on u.id = t.user_id 
    where lower(u.id) like lower('%${search}%')`;
    db.query(query, (err, result) => {
      if (err) {
        console.log(err.message);
        resolve(systemError());
      }
      resolve(success(result.rows));
    });
  });
};

// const getSeat = ()

const transactionRepo = {
  createTransaction,
  getHistory,
};

module.exports = transactionRepo;
