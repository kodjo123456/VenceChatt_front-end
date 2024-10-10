import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Style.css";
import axios from "axios";

export default function GroupDetails() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null); // État pour les détails du groupe
  const [members, setMembers] = useState([]); // État pour la liste des membres
  const [email, setEmail] = useState('');
  const AdderId = localStorage.getItem('UserId');
  const [adminName, setAdminName] = useState(""); 
useEffect(() => {
  const fetchGroupDetails = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/ListGroups', {
        group_id: groupId,
      })
      console.log(response.data);
      setGroup(response.data);
      setMembers(response.data.members);
      const admin = response.data.members.find(member => member.id == AdderId);
      if (admin) {
        setAdminName(admin.name);
      }
      console.log(admin.name);
      
    } catch (error) {
      console.error(error);
    }
  };
  fetchGroupDetails();
  
}, [groupId]);

// const handleDelete = async (memberId) => {
//   try {
//     // Logique pour expulser le membre
//     const response = await axios.post('http://localhost:8000/api/expelMember', {
//       group_id: groupId,
//       member_id: memberId,
//     });

//     if (response.data.success) {
//       // Met à jour l'état des membres après l'expulsion
//       setMembers(prevMembers => prevMembers.filter(member => member.id !== memberId));
//       console.log("Membre expulsé avec succès");
//     } else {
//       console.error("Erreur lors de l'expulsion du membre");
//     }
//   } catch (error) {
//     console.error("Erreur lors de l'appel à l'API:", error);
//   }
// };


  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/InviteMember', {
        group_id: groupId,
        email: email,
        id: AdderId,
      });

      // if(response.data.)
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }

    
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: "100%",
        flexDirection: "column",
        backgroundColor: "#0d3b66"
      }}
    >
      <p>
        {groupId}
      </p>
      {/* Display group details here */}
      {/* Add any necessary components or styling */}
      {/* Example: <h1>Group Details</h1> */}
      {group && (
        <>
          <div>
            <img
              style={{ width: "200px", height: "200px", borderRadius: "50%" }}
              src={`http://localhost:8000/uploads/${group.group.avatar}`}
              alt="Group Avatar"
            />
          </div>
          {/* {console.log(group.group.name)}; */}
          
          <h1>{group.group.name}</h1>
          <h3>Créé par <span style={{color:"green",textDecoration:"underline"}}>{adminName}</span>  le {new Date(group.group.created_at).toLocaleDateString()}</h3>
          <h3>Membres : {members.length}</h3>
        </>
      )}
      {/* <h1>{group.name}</h1> */}
   
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>image</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {members.map((member) => (
              <tr key={member.id}>
                <td>
                  <img
                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                    src={`http://localhost:8000/uploads/${member.avatar}`} // Avatar du membre
                    alt={member.name}
                  />
                </td>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>
                {member.id != AdderId ? (
                  //on peut definir cette fonction apres au besoin
                  //et aussi tres important tout le monde ne peut pas expulser. seul l'admin peut expulser
                    <a href="#" onClick={() => handleDelete(member.id)}>Expulser</a>
                  ) : (
                    <p style={{color:"red", fontWeight:"bold",fontSize:"40px"}}>ADMIN</p>
                  )
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="invitation">
        <div>
      <h3>inviter un membre non inscrit au groupe</h3>

        </div>
<div className="invit-form">
<p>Invitez un membre non inscrit au groupe</p>
<p>il sera auтомatiquement ajouté au groupe lors de sa connexion sur chatterBox</p>

<input type="email" placeholder="Email du nouveau membre" style={{width:"300px", height:"30px"}} value={email} onChange={(e) => setEmail(e.target.value)} />
<button onClick={handleSubmit}  >Inviter</button>
</div>
      </div>
<div style={{marginTop:"40px"}}>

</div>
      {/* Merci pour votre participation */}
    </div>
  );
}

