const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWTR = require("jwt-redis").default;
const db = require("../config/database");
const client = require("../config/redis");
const response = require("../helpers/response");
const jwtr = new JWTR(client);
const { sendVerifMail, sendMails } = require("../config/email");
const {
  success,
  systemError,
  created,
  emailreadyexsits,
  wrongData,
  userLogin,
  custMsg,
} = require("../helpers/templateResponse");

const getMovies = (params) => {
  return new Promise((resolve) => {
    const query = `select m.name, m.image , m.relase_date , m.duration, m.synopsis, c."name" as category, d.name as director, cs."name" as cast, s.name as studios, t.times as time from movies m left join categoriey_movie cm on  m.id  = cm.movies_id join category c on cm.category_id = c.id 
        join director d on m.id = d.movies_id join "cast" cs on m.id = cs.movies_id  join times_studio_movies tsm on m.id = tsm.movies_id  join studios s on tsm.studios_id = s.id join times t on tsm.times_id = t.id where m.id = $1`;
    db.query(query, [params], (err, result) => {
      if (err) {
        console.log(err.message);
        resolve(systemError());
      }
      //   console.log(result);
      let name = null;
      let image = null;
      let relase_date = null;
      let duration = null;
      let synopsis = null;
      let director = null;
      let category = [];
      let cast = [];
      let showtimes = [];
      result.rows.forEach((data) => {
        if (!category.includes(data.category)) category.push(data.category);
        if (!cast.includes(data.cast)) cast.push(data.cast);
        let showdata = showtimes.find((datas) => {
          return datas.hasOwnProperty(data.studios);
        });
        if (!showdata) {
          const news = {
            [data.studios]: [data.time],
          };
          showtimes.push(news);
        }
        if (showdata) {
          showtimes.find((datas) => {
            if (datas.hasOwnProperty(data.studios)) {
              if (!datas[data.studios].includes(data.time)) {
                datas[data.studios].push(data.time);
              }
            }
          });
        }
        if (data.name !== name) name = data.name;
        if (data.image !== image) image = data.image;
        if (data.relase_date !== relase_date) relase_date = data.relase_date;
        if (data.duration !== duration) duration = data.duration;
        if (data.synopsis !== synopsis) synopsis = data.synopsis;
        if (data.director !== director) director = data.director;
      });
      const data = {
        name,
        image,
        relase_date,
        duration,
        synopsis,
        director,
        category,
        cast,
        showtimes,
        // studios,
        // time,
      };
      resolve(success(data));
    });
  });
};

const getallMovies = (body) => {
  return new Promise((resolve) => {
    const query = `select m.name as title, m.image, c."name" as category from movies m left join categoriey_movie cm on m.id  = cm.movies_id join category c on cm.category_id = c.id`;
    db.query(query, (err, results) => {
      if (err) {
        console.log(err.message);
        resolve(systemError());
      }
      let data = [];
      results.rows.forEach((datas) => {
        if (data.length !== 0) {
          data.forEach((forGenre) => {
            if (forGenre["title"] === datas.title) {
              return forGenre["genre"].push(datas.category);
            }
            return;
          });
        }
        if (data.length === 0) {
          const addData = {
            title: datas.title,
            image: datas.image,
            genre: [datas.category],
          };
          data.push(addData);
        }
        const checkdata = data.some((item) => item.title === datas.title);
        if (!checkdata) {
          data.forEach((forGenre) => {
            if (forGenre["title"] !== datas.title) {
              const addData = {
                title: datas.title,
                image: datas.image,
                genre: [datas.category],
              };
              return data.push(addData);
            }
          });
        }
      });
      resolve(success(data));
    });
  });
};

const getShowMovies = (params) => {
  return new Promise((resolve) => {
    const { month } = params;
    const query = `select m.name as title, m.image, c."name" as category, TO_CHAR(m.relase_date , 'DD/MM/YYYY') as date from movies m left join categoriey_movie cm on m.id  = cm.movies_id join category c on cm.category_id = c.id`;
    db.query(query, (err, results) => {
      if (err) {
        console.log(err.message);
        resolve(systemError());
      }
      let data = [];
      results.rows.forEach((datas) => {
        if (data.length !== 0) {
          data.forEach((forGenre) => {
            if (forGenre["title"] === datas.title) {
              return forGenre["genre"].push(datas.category);
            }
            return;
          });
        }
        if (data.length === 0) {
          const addData = {
            title: datas.title,
            image: datas.image,
            genre: [datas.category],
            date: datas.date,
          };
          data.push(addData);
        }
        const checkdata = data.some((item) => item.title === datas.title);
        if (!checkdata) {
          data.forEach((forGenre) => {
            if (forGenre["title"] !== datas.title) {
              const addData = {
                title: datas.title,
                image: datas.image,
                genre: [datas.category],
                date: datas.date,
              };
              return data.push(addData);
            }
          });
        }
      });
      let nowShowing = [];
      let upComing = [];
      let today = new Date();
      let dd = String(today.getDate()).padStart(2, "0");
      let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      let yyyy = today.getFullYear();
      today = dd + "/" + mm + "/" + yyyy;
      data.some((item) => {
        if (item.date === today) {
          nowShowing.push({ item });
        }
        const monthData = item.date.split("/")[1];
        if (month) {
          if (month === monthData) {
            upComing.push({ item });
          }
        }
        if (!month) {
          upComing.push({ item });
        }
      });
      const senData = {
        nowShowing,
        upComing,
      };
      resolve(success(senData));
    });
  });
};

const movieRepo = {
  getMovies,
  getallMovies,
  getShowMovies,
};

module.exports = movieRepo;
