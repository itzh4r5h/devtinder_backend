# DevTinder Backend

## API's List

### Auth - prefix (/api/v1/auth)
- POST /signup
- POST /signin
- POST /signout


### Users - prefix (/api/v1/auth)
- GET /me
- PATCH /edit


### Connections - prefix (/api/v1/connection)
- POST /req - for sending connection request
- GET /req - for viewing all the sent request which are in pending state i.e. not accepted or rejected yet
- POST /review - for accepting or rejecting receieved requests
- GET /review - for viewing received requests
- GET /view - for viewing all the connections
- GET /feed - for getting all users who are not connected to each other




## 🚀 Tech Stack

![MongoDB](https://img.shields.io/badge/MongoDB-%2347A248.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![Express](https://img.shields.io/badge/Express-%23000000.svg?style=for-the-badge&logo=express&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-%23339933.svg?style=for-the-badge&logo=node.js&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-%23000000.svg?style=for-the-badge&logo=jsonwebtokens&logoColor=white)