# ![XAZAM](https://media.discordapp.net/attachments/1047450902841262083/1049295052809179228/XAZAMm.png?width=35&height=30) **XAZAM**

[![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)
[![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
<br>

---

# **Introduction**

XAZAM is a website booking ticket movies based on website.

---

## 𓆙 Table of Contents

- [Introduction](#Introduction)
- [Table of Contents](#𓆙-Table-of-Contents)
- [Requirement](#𓆙-Requirement)
- [Installation](#)
  - [Windows](#𓆙-Windows-Installation)
  - [Linux](#𓆙_Linux_Installation)
- [How to run](#𓆙-How-to-run)
- [Route](#𓆙-Documentation-Postman)
- [Documentation Postman](#𓆙-Documentation-Postman)
- [Related Project](#𓆙-Related-Project)
- [Contributor](#𓆙-Contributors)

## 𓆙 Requirement

This repo require a [NodeJS](https://nodejs.org/)

[ENV](#ENV) File

## 𓆙 Windows Installation

First of all, you need to install [Git](https://git-scm.com/download/win) & [NodeJS](https://nodejs.org/). Then open your git bash, and follow this:<br>

```sh
$ git clone https://github.com/salzteam/RIMA-BE.git
$ cd RIMA-BE
```

## 𓆙 Linux Installation

```sh
$ apt-get update
$ apt-get install git-all
$ apt-get install nodejs-current
$ git clone https://github.com/salzteam/XAZAM-BE.git
$ cd XAZAM-BE
```

## 𓆙 How to run

1. Install file using [WINDOWS](#Windows-Installation) OR [LINUX](Linux-Installation)

2. Add .env file at root folder, and add following

```sh
DB_HOST_DEV = ""
DB_USER_DEV = ""
DB_PASS_DEV = ""
DB_NAME_DEV = ""
DB_PORT = ""
SECRET_KEY = ''
ISSUER = ''
REDIS_URL = ''
REDIS_USER = ''
REDIS_PWD = ''
MAIL_EMAIL = ""
MAIL_PASSWORD = ""
CLOUDINARY_NAME = ''
CLOUDINARY_KEY = ''
CLOUDINARY_SECRET = ''
LINK_DEPLOYMENT = ''
CLIENT_KEY_MIDTRANS = ''
SERVER_KEY_MIDTRANS = ''
```

3. Starting application

```sh
$ npm run dev
```

## 𓆙 Route

| Endpoint                     |      Method      | Info         | Remark                                |
| ---------------------------- | :--------------: | :----------- | :------------------------------------ |
| /api/auth                    | `DELETE` `POST` `PATCH`  | Auth         | Login, Logout, Forgot,Register                       |
| /api/profile                   |      `GET` `PATCH`       | Profile         | Get, Edit, Change Password                        |                |
| /api/transactions            |      `GET` `POST`       | Transactions | Create, Get-Seat, Get-SeatSelect, Get-Ticket-Detail, Get-History |          |
| /api/movies                |   `POST` `GET` `DELETE`   | Movies     | Create, Get, Get-Id, Get-Showing-Detail, Get-Studios,Delete             |

## 𓆙 Documentation Postman

Click here [POSTMAN](https://documenter.getpostman.com/view/23707233/2s8Yt1rp93)

<BR>
<BR>

## 𓆙 Related-Project
- [FRONT-END](https://github.com/Rama-z/Xazam-FE/tree/salz)
- [BACK-END](https://github.com/salzteam/Xazam-BE)

## 𓆙 Contributor
  <table>
    <tr>
      <td style="display: flex; gap:1rem">
        <a href="https://github.com/salzteam">
          <img width="100" src="https://media.discordapp.net/attachments/1042328276623966313/1044211472001138799/A5EA7BEF-0326-4ED0-A439-A64A680A774B.jpg?width=250&height=250" alt=""><br/>
          <center><sub><b>Akshal </b></sub></center>
        </a>
        <a href="https://github.com/salzteam">
          <img width="100" src="https://avatars.githubusercontent.com/u/105290499?v=4?width=500&height=1000" alt=""><br/>
          <center><sub><b>Zanuar </b></sub></center>
        </a>
        </td>
    </tr>
  </table>
<h1 align="center"> THANK FOR YOUR ATTENTION </h1>
