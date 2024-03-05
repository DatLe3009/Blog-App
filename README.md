# Docs API

# root API: https://blog-app-latest.onrender.com

## methods|url                                                                      |function                    |req.body

post      https://blog-app-latest.onrender.com/register                              register                     {email, username, password} 

post      https://blog-app-latest.onrender.com/login                                 login                        {email, password}

get       https://blog-app-latest.onrender.com/refresh                               refreshToken

get       https://blog-app-latest.onrender.com/logout                                logout

get       https://blog-app-latest.onrender.com/api/v1/users                          getAllUsers

get       https://blog-app-latest.onrender.com/api/v1/users/me                       getUserByMe

get       https://blog-app-latest.onrender.com/api/v1/users/search?query=            getUsersByQuery

get       https://blog-app-latest.onrender.com/api/v1/users/:id                      getUser

put       https://blog-app-latest.onrender.com/api/v1/users/me                       updateUserByMe               {password, username}

put       https://blog-app-latest.onrender.com/api/v1/users/:id                      updateUser                   {password, usernmae}

delete    https://blog-app-latest.onrender.com/api/v1/users/:id                      deleteUser

get       https://blog-app-latest.onrender.com/api/v1/users/:id/posts                getPostsByUserID

get       https://blog-app-latest.onrender.com/api/v1/users/:id/comments             getCommentsByUserID

get       https://blog-app-latest.onrender.com/api/v1/users/:id/friends              getFriendsByUserID

post      https://blog-app-latest.onrender.com/api/v1/users/:id/friends/:friendId    createNewFriendshipByAdmin

delete    https://blog-app-latest.onrender.com/api/v1/users/:id/friends/:friendId    deleteFriendshipByAdmin


get       https://blog-app-latest.onrender.com/api/v1/profiles                       getAllProfiles

get       https://blog-app-latest.onrender.com/api/v1/profiles/me                    getProfileByMe

get       https://blog-app-latest.onrender.com/api/v1/profiles/search?query=         getProfilesByQuery

get       https://blog-app-latest.onrender.com/api/v1/profiles/:id                   getProfile

post      https://blog-app-latest.onrender.com/api/v1/profiles                       createNewProfile          {name, address, phone, sex, age}

put       https://blog-app-latest.onrender.com/api/v1/profiles/me                    updateProfileByMe         {name, address, phone, sex, age}

put       https://blog-app-latest.onrender.com/api/v1/profiles/:id                   updateProfile             {name, address, phone, sex, age}

delete    https://blog-app-latest.onrender.com/api/v1/profiles/:id                   deleteProfile

get       https://blog-app-latest.onrender.com/api/v1/profiles/:id/user              getUserByProfileID



get            https://blog-app-latest.onrender.com/api/v1/posts                     getAllPosts

get            https://blog-app-latest.onrender.com/api/v1/posts/me                  getPostsByMe

get            https://blog-app-latest.onrender.com/api/v1/posts/search?query=       getPostsByQuery

get            https://blog-app-latest.onrender.com/api/v1/posts/:id                 getPost

post            https://blog-app-latest.onrender.com/api/v1/posts                    createNewPost              {title, content}

put            https://blog-app-latest.onrender.com/api/v1/posts/:id                 updatePost                 {title, content}

delete            https://blog-app-latest.onrender.com/api/v1/posts/:id              deletePost

get            https://blog-app-latest.onrender.com/api/v1/posts/:id/comments        getCommentsByPostID        

post            https://blog-app-latest.onrender.com/api/v1/posts/:id/comments       createNewComment           {content}

get            https://blog-app-latest.onrender.com/api/v1/posts/:id/likes           getLikesByPostID

post            https://blog-app-latest.onrender.com/api/v1/posts/:id/likes          createNewLike

delete            https://blog-app-latest.onrender.com/api/v1/posts/:id/likes        deleteLike



get            https://blog-app-latest.onrender.com/api/v1/comments                  getAllComments

get            https://blog-app-latest.onrender.com/api/v1/comments/me               getCommentsByMe

get            https://blog-app-latest.onrender.com/api/v1/comments/:id              getComment

post            https://blog-app-latest.onrender.com/api/v1/comments                 createNewComment

put            https://blog-app-latest.onrender.com/api/v1/comments/:id              updateComment

delete            https://blog-app-latest.onrender.com/api/v1/comments/:id           deleteComment


get            https://blog-app-latest.onrender.com/api/v1/friendships               getAllFriendships

get            https://blog-app-latest.onrender.com/api/v1/friendships/me            getFriendshipsByMe

get            https://blog-app-latest.onrender.com/api/v1/friendships/:id           getFriendship

post            https://blog-app-latest.onrender.com/api/v1/friendships              createNewFriendship          {friend}

put            https://blog-app-latest.onrender.com/api/v1/friendships/:id           updateFriendship             {status}

delete            https://blog-app-latest.onrender.com/api/v1/friendships/:id        deleteFriendship




