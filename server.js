const express = require('express');
const queryString = require('query-string');

const app = express();

const USERS = [
  {id: 1,
   firstName: 'Joe',
   lastName: 'Schmoe',
   userName: 'joeschmoe@business.com',
   position: 'Sr. Engineer',
   isAdmin: true,
   password: 'password'
  },
  {id: 2,
   firstName: 'Sally',
   lastName: 'Student',
   userName: 'sallystudent@business.com',
   position: 'Jr. Engineer',
   isAdmin: true,
   password: 'password'
  },
  {id: 3,
   firstName: 'Lila',
   lastName: 'LeMonde',
   userName: 'lila@business.com',
   position: 'Growth Hacker',
   isAdmin: false,
   password: 'password'
  },
  {id: 4,
   firstName: 'Freddy',
   lastName: 'Fun',
   userName: 'freddy@business.com',
   position: 'Community Manager',
   isAdmin: false,
   password: 'password'
  }
];

function gateKeeper(req, res, next) {
  const parsed = queryString.parse(req.get('x-username-and-password'));
  let authenticated = USERS.find(function(user){
    return user.userName === parsed.user && user.password === parsed.pass;
  });
  req.user = authenticated ? authenticated : undefined;
  next();
}

app.get("/api/users/me", gateKeeper, (req, res) => {
  if (req.user === undefined) {
    return res.status(403).json({message: 'Must supply valid user credentials'});
  }
  const {firstName, lastName, id, userName, position} = req.user;
  return res.json({firstName, lastName, id, userName, position});
});

app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${process.env.PORT}`);
});
