class WebrtcMessageHandler {

  /**
   *  this function handle the request of call comes from agent to all the clients with getingusermedia
   * @param {*} message 
   * @param {*} socket 
   */
  handleCallRequest(message, socket) {
    const callRequestToCallee = {
      type: '_CALL_REQUEST',
      data: { ...message },
    };

    if (message.meetingId) {
      socket.broadcast.emit('message', callRequestToCallee);
      console.log('Agents request : ', message.userName);
    }
  }

  /**
   *  this handle the response from all the clients if they taking call or not and response send back to the agent.
   * @param {*} message 
   * @param {*} socket 
   */
  handleCallResponse(message, socket) {
    const callResponceToCaller = {
      type: '_CALL_RESPONSE',
    };

    if (message.callStatus) {
      callResponceToCaller['data'] = { ...message };
    } else {
      console.log('CAll rejected ');
      callResponceToCaller['data'] = {
        id: 'rejected',
        message: 'Call is declined',
      };
    }
    socket.broadcast.emit('message', callResponceToCaller);
  }

  /**
   *  this handle the request (SDP) which comes from agent to all the client.
   * @param {*} message 
   * @param {*} socket 
   */
  handleSdpOfferRequest(message, socket) {
    console.log(`Received Sdp offer from Agent ${message.userName}`);
    const sdpOffer = {
      type: '_SDP_OFFER',
      data: { ...message },
    };

    socket.broadcast.emit('message', sdpOffer);
  }

  /**
   * this handle the sdp answer of users and send back to the agent.
   * @param {*} message 
   * @param {*} socket 
   */
  handleSdpAnswer(message, socket) {
    console.log('Received Sdp answer from User : ', message.userName);
    const sdpAnswer = {
      type: '_SDP_ANSWER',
      data: { ...message },
    };

    socket.broadcast.emit('message', sdpAnswer);
  }

  /**
   * this handle the connected users ice candidate.
   * @param {*} message 
   * @param {*} socket 
   */
  handleIceCandidateRequest(message, socket) {
    const iceCandidate = {
      type: '_ICE_CANDIDATE',
      data: { ...message },
    };

    socket.broadcast.emit('message', iceCandidate);
    console.log(`Sharing of iceCandidate of user ${message.userName}`);
  }

  /**
   * this function pass the call end message to the another users.
   * @param {*} message 
   * @param {*} socket 
   */
  handleCallEnd(message, socket) {
    console.log('************** CALL END ************** ');
    const callEnd = {
      type: '_CALL_ENDED',
      data: { ...message, message: 'plain webrtc call ended' },
    };
    socket.broadcast.emit('message', callEnd);
    console.log(`Call ended by user ${message.userName}`);
  }
}

module.exports = WebrtcMessageHandler;
