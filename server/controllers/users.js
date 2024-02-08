import User from "../models/User.js";
import axios from 'axios';

/*READ*/

export const getUser = async (req, res) => {
  try {
    // const addUserToLeads = async () => {

      // const options = {
      //   url: 'https://accounts.zoho.in/oauth/v2/token',
      //   method: 'post',
      //   params: {
      //     code: '1000.11d842ff71370e366baf12548b687d98.fffe5ea7800aa8960f7ef07012939ebd',
      //     grant_type: 'authorization_code',
      //     client_id: '1000.XSGUA0SYWUBCUPAOJCBZ2L5Z9SZKIU',
      //     client_secret: 'ef0c99cd0c78ef7bab27339dfd248b8c182694e9d0',
      //     redirect_uri: 'http://localhost:3001',
      //   },
      //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      // };
      // const response = await axios(options);
      // console.log(response,"555555555")
      // return response;
      // const refreshToken = response.data.refresh_token;
      // }
      
      // console.log(addUserToLeads());

  //  const url = "https://mail.zoho.com/api/organization/60024903207";
  //  const response = await axios.get(url);
  //  console.log(response)
  
    const clientId = '1000.XSGUA0SYWUBCUPAOJCBZ2L5Z9SZKIU';
    const redirectUri = 'https://deluge.zoho.com/delugeauth/callback';
    const scope = 'zohobookings.data.CREATE'; // Specify the scopes your application needs
    
    const authorizationUrl = `https://accounts.zoho.in/oauth/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    console.log("55",authorizationUrl,"000000")
    res.redirect(authorizationUrl);
  
    return res.json();
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => user.findById(id))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, picturePath, location, occupation }) => {
        return {
          _id,
          firstName,
          lastName,
          picturePath,
          location,
          occupation,
        };
      }
    );
    res.status(200).json({
      message: "Friends retrieved successfully",
      data: formattedFriends,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

/*UPDATE*/
export const addRemoveFriends = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.fiends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => user.findById(id))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, picturePath, location, occupation }) => {
        return {
          _id,
          firstName,
          lastName,
          picturePath,
          location,
          occupation,
        };
      }
    );
    res
      .status(200)
      .json({
        message: "Friends updated successfully",
        data: formattedFriends,
      });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
