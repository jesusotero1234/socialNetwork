const express = require("express");
const router = express.Router();
const {
    friendshipStatus,
    sendFrienshipRequest,
    deleteRequest,
    acceptRequest
} = require("../db");

router.get("/:id", async (req, res) => {
    console.log(req.params.id, req.session.userId);

    try {
        const data = await friendshipStatus(req.session.userId, req.params.id);
        console.log("data from friedship", data);

        //////////////////////
        /////// sender ///////
        //////////////////////

        //The person who is sending the request!
        //Compare 2 scenarios

        //1) if the array is empty then it means that they don't follow each other
        if (data.length == 0) {
            res.json({
                data: "Make friend request"
            });
            return;
        }

        const obj = {
            sender: data[0].sender_id,
            receiver: data[0].receiver_id
        };

        if (req.session.userId == obj.sender) {
            if (data.length > 0 && !data[0].accepted) {
                //2) If the user has already sent a request then show the cancel request option
                res.json({
                    data: "Cancel the request to the user"
                });
            } else if (data.length > 0 && data[0].accepted) {
                //2) If the user has already sent a request then show the cancel request option
                res.json({
                    data: "Remove friend"
                });
            }
        }

        //////////////////////
        ///////receiver //////
        /////////////////////

        //The person is receiving the request!

        //Compare 2 scenarios
        //1) if the array is empty then it means that they don't follow each other

        if (req.session.userId == obj.receiver) {
            if (data.length > 0 && !data[0].accepted) {
                //2) If the user has already sent a request then show the cancel request option
                res.json({
                    data: "You have a request from this user"
                });
            } else if (data.length > 0 && data[0].accepted) {
                //2) If the user has already sent a request then show the cancel request option
                res.json({
                    data: "Remove friend"
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.json({
            error: "something went wrong"
        });
    }
});

//Send friend request fro the first time
router.post("/sendFriendship", async (req, res) => {
    console.log("req.body from sendFriendship", req.body);

    //if the status is that they haven't send any request then:
    if (req.body.buttonText == "Make friend request") {
        try {
            await sendFrienshipRequest(req.session.userId, req.body.receiverId);

            res.json({
                data: "Cancel the request to the user"
            });
        } catch (error) {
            console.log(error);
            res.json({
                error: "something went wrong in send the Make friend request"
            });
        }
    }

    //if the status is Cancel the request to the user:
    if (req.body.buttonText == "Cancel the request to the user") {
        try {
            await deleteRequest(req.session.userId, req.body.receiverId);
            res.json({
                data: "Make friend request"
            });
        } catch (error) {
            console.log(error);
            res.json({
                error: "something went wrong in Cancel the request to the user"
            });
        }
    }

    ////Here is when you are the one who received a request!!!!

    //if the status is Cancel the request to the user:

    if (req.body.buttonText == "You have a request from this user") {
        try {
            await acceptRequest(req.body.receiverId, req.session.userId);
            res.json({
                data: "Remove friend"
            });
        } catch (error) {
            console.log(error);
            res.json({
                error: "something went wrong in Cancel the request to the user"
            });
        }
    }

    //Retriveing data to check you are the sender or receiver
    const data = await friendshipStatus(
        req.session.userId,
        req.body.receiverId
    );

    const obj1 = {
        sender: data[0].sender_id,
        receiver: data[0].receiver_id
    };

    //If you are the sender
    if (
        req.body.buttonText == "Remove friend" &&
        req.session.userId == obj1.sender
    ) {
        try {
            await deleteRequest(req.session.userId, req.body.receiverId);
            res.json({
                data: "Make friend request"
            });
        } catch (error) {
            console.log(error);
            res.json({
                error: "something went wrong in Cancel the request to the user"
            });
        }
    }

    //If you are the receiver
    if (
        req.body.buttonText == "Remove friend" &&
        req.session.userId == obj1.receiver
    ) {
        try {
            await deleteRequest(req.body.receiverId, req.session.userId);
            res.json({
                data: "Make friend request"
            });
        } catch (error) {
            console.log(error);
            res.json({
                error: "something went wrong in Cancel the request to the user"
            });
        }
    }
});

module.exports = router;
