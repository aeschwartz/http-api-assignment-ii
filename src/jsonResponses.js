const users = {}; // to be added in

const respond = (req, res, status, object) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  if (req.method !== 'HEAD' || status === 204) res.write(JSON.stringify(object));
  res.end();
};

const getUsers = (req, res) => {
  respond(req, res, 200, { users });
};

const addUser = (req, res, query) => {
  const responseJSON = {
    message: 'Name and age are both required.',
  };


  // basically on error ->
  // check to make sure we have both fields
  // We might want more validation than just checking if they exist
  // This could easily be abused with invalid types (such as booleans, numbers, etc)
  // If either are missing, send back an error message as a 400 badRequest
  if (!query.name || !query.age) {
    responseJSON.id = 'missingParams';
    return respond(req, res, 400, responseJSON);
  }

  // if no error, set default response to 201
  let responseCode = 201;

  // if the name is already a key, change 201 (created) to 204 (updated)
  if (users[query.name]) responseCode = 204;

  // copy in data regardless
  users[query.name] = {
    name: query.name,
    age: query.age,
  };

  // if response is created, then set our created message
  // and sent response with a message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respond(req, res, responseCode, responseJSON);
  }
  // 204 has an empty payload, just a success
  // It cannot have a body, so we just send a 204 without a message
  // 204 will not alter the browser in any way!!!
  return respond(req, res, responseCode);
};

const notReal = (req, res) => {
  respond(req, res, 404, {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  });
};
module.exports = {
  getUsers,
  addUser,
  notReal,
};
