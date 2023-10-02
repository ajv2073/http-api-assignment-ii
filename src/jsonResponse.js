const users = {};
let numUsers = 0;

//JSON response
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

//JSON head response
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

//Get the users
const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };
  return respondJSON(request, response, 200, responseJSON);
};

//Successful error code
const getUsersMeta = (request, response) => respondJSONMeta(request, response, 200);

//404 not found code
const notReal = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  return respondJSON(request, response, 404, responseJSON);
};

//404 code with no message and id
const notRealMeta = (request, response) => respondJSONMeta(request, response, 404);

//Add user
const addUser = (request, response, params) => {
  const responseJSON = {
    message: 'Created Successfully',
  };

  //400 code if missing information
  if (!params.age || !params.name) {
    responseJSON.message = 'Name and age are both required.';
    responseJSON.id = 'badRequest';
    return respondJSON(request, response, 400, responseJSON);
  }

  //Looks for same name, and updates age with 204 code
  for (let i = 0; i < numUsers; i++) {
    const key = `user${String(i + 1)}`;
    if (users[key] && users[key].name === params.name) {
      users[key].age = params.age;
      return respondJSONMeta(request, response, 204);
    }
  }

  //Adds the user to the list and returns 201 code
  const key = `user${String(numUsers + 1)}`;
  const newUser = { name: params.name, age: params.age };
  users[key] = newUser;
  numUsers++;
  return respondJSON(request, response, 201, responseJSON);
};

module.exports = {
  getUsers,
  getUsersMeta,
  notReal,
  notRealMeta,
  addUser,
};