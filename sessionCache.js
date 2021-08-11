
//global declaration of the userlist array.

var userList = [];
var usersMesseges = [];

class SessionsCache
{
    //reponsible for get the user data.
    getUserData(users)
    {
        userList.push(users);
    }

    //responsible for the storing the messeges of users with respective their names.
    getUsersChat(usersChat)
    {
        usersMesseges.push(usersChat);
    }

    displayUsers()
    {
        console.log(userList);
    }
}

module.exports = SessionsCache;

