Project Title :-  WebRTC Implementation of peer to peer communication.

(The project implements the working of webRTC technology with KMS (kurento media server) and without KMS).

Installation :-
To use the functionality of webRTC technology with kMS server, You need to install KMS server on your local machine.

How to run :-
to run the backend and frontend application use/hit following command :-

1. npm install :- Use this command to install all the dependecies require for the project in both backend and
                  frontend side application.

2. npm start :- Use this command to execute both frontend and backend side application.


Step by step execution of application :- 
1. When both the application will start using 'npm start' command. End user will get redirect to the browser.
2. web page will shows the input box for meeting name/id and userName and one checkbox for requesting kms call.
3. After filling the information click on the 'create' button. (click create button for first time when agent wants
   to create meeting).
4. agent who create the meeting will redirect to next page where he will appear call button for requesting the call.
   And meetingId display on right corner of the webpage, this meetingId is useful for another users who want to join
   the same meeting created by agent.
5. user who are going to join the meeting , after serving the webpage he need to enter the meetingId which is
   generated on the agent webpage, add into the meetingId box then add the userName and click on the 'join' button.

NOTE :- when creating the meeting, If agent select the checkBox for kms call then all the user who are going to join
        the same meeting strictly needed to select that checkbox. (otherwise call can't be establish beetween them)

6. Now agent can send the call request to user by clicking on 'call' button, and user will get popup of 'accept' or 
   'decline' call. If user decline the call then communication not established between them, if accepted then communication will start between agent and user and while communication is running there is one button is enabled
   i.e 'end' for stop the communication.

7. After click on 'stop' button communication for both agent and user will stop. And they can display 'call' button
   on the screen and they can able to request of call again.

