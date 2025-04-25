import { useEffect, useState } from "react";
import axios from "axios";
import "./Waste.css"

interface User {
  id: string;
  FacilityId: string;
  Location: string;
  Capacity: string;
  WasteTypeHandled: string;
  OperatingHours: string;
}

const Form: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<User>({
    id: "",
    FacilityId: "",
    Location: "",
    Capacity: "",
    WasteTypeHandled: "",
    OperatingHours: "",
  });
  const [editingId, setEditingId] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:3000/users/${editingId}`, formData);
      } else {
        await axios.post("http://localhost:3000/users", formData);
      }
      fetchUsers();
      setFormData({
        id: "",
        FacilityId: "",
        Location: "",
        Capacity: "",
        WasteTypeHandled: "",
        OperatingHours: "",
      });
      setEditingId("");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    alert("Submitted Successfully");
  };

  const handleEdit = (id: string) => {
    const userToEdit = users.find((user) => user.id === id);
    if (userToEdit) {
      setFormData(userToEdit);
      setEditingId(id);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
    alert("Deleted Successfully");
  };

  return (
    <div>
      <h1>Waste Management System</h1>
      <form onSubmit={handleSubmit}>
        <h2>Enter Details</h2>
        <input type="text" name="FacilityId" placeholder="FacilityId" value={formData.FacilityId} onChange={handleChange} />
        <pre></pre>
        <input type="text" name="Location" placeholder="Location" value={formData.Location} onChange={handleChange} />
        <pre></pre>
        <input type="text" name="Capacity" placeholder="Capacity" value={formData.Capacity} onChange={handleChange} />
        <pre></pre>
        <input type="text" name="WasteTypeHandled" placeholder="WasteTypeHandled" value={formData.WasteTypeHandled} onChange={handleChange} />
        <pre></pre>
        <input type="text" name="OperatingHours" placeholder="OperatingHours" value={formData.OperatingHours} onChange={handleChange} />
        <pre></pre>
        <button type="submit">{editingId ? "Update" : "Submit"}</button>
      </form>
      <div className="search">
      <h2>List of Facilities</h2>
      <label className="search">Search by FacilityId:</label>
      <input className="search" type="text" placeholder="Search by FacilityId" value={search} onChange={(e) => setSearch(e.target.value)}/>
      </div>
      <table>
        <thead>
          <tr>
            <th>FacilityId</th>
            <th>Location</th>
            <th>Capacity</th>
            <th>WasteTypeHandled</th>
            <th>OperatingHours</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((user) => user.FacilityId.toLowerCase().includes(search.toLowerCase()))
            .map((user) => (
              <tr key={user.id}>
                <td>{user.FacilityId}</td>
                <td>{user.Location}</td>
                <td>{user.Capacity}</td>
                <td>{user.WasteTypeHandled}</td>
                <td>{user.OperatingHours}</td>
                <td>
                  <button onClick={() => handleEdit(user.id)} style={{backgroundColor: "blue", color: "white"}}>Edit</button>
                  <button onClick={() => handleDelete(user.id) } style={{backgroundColor: "red", color: "white"}}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <h3 >{users.length === 0 ? "No data available" : ""} </h3>
    </div>
  );
};

export default Form;
