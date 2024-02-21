import React, { useState, useEffect } from 'react';
import { Table, Tbody, Thead, Th, Tr, Td } from '@chakra-ui/react';

interface UserData {
  _id: string;
  rollNumber: string;
  registrationNumber: string;
  name: string;
  contact: { type: string; contact: string }[];
  course: string;
  medium: string;
  batch: string;
  gender: string;
  father: string;
}

const DataPage = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [filteredUser, setFilteredUser] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterKey, setFilterKey] = useState<string>('name');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://api.stage.next.gcisikar.com/api/v1/usercourse/search?key=${filterKey}&value=${searchQuery}`
      );
      const fetchedUserData = await response.json();
      setUserData(fetchedUserData.data);
      setFilteredUser(fetchedUserData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    if (lowerCaseQuery === '') {
      setFilteredUser(userData);
    } else {
      const filtered = userData.filter(user =>
        user[filterKey as keyof UserData]
          .toString()
          .toLowerCase()
          .includes(lowerCaseQuery)
      );
      setFilteredUser(filtered);
    }
  }, [searchQuery, userData, filterKey]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchData();
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterKey(e.target.value);
  };

  return (
    <main style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <input
          placeholder="Search"
          value={searchQuery}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          style={{ marginRight: '0.5rem', padding: '0.5rem' }}
        />
        <select
          value={filterKey}
          onChange={handleSelectChange}
          style={{ padding: '0.5rem' }}
        >
          <option value="name">Name</option>
          <option value="rollNumber">Roll Number</option>
          <option value="registrationNumber">Registration Number</option>
          <option value="contact">Contact</option>
        </select>
      </div>
      <Table variant="simple" size="md">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Roll No</Th>
            <Th>Gender</Th>
            <Th>Registration Number</Th>
            <Th>Contact</Th>
            <Th>Course</Th>
            <Th>Batch</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredUser.map(user => (
            <Tr key={user._id}>
              <Td>{user.name}</Td>
              <Td>{user.rollNumber}</Td>
              <Td>{user.gender}</Td>
              <Td>{user.registrationNumber}</Td>
              <Td>
                {user.contact.map((contact, index) => (
                  <div key={index}>
                    {contact.type && <span>{contact.type}: </span>}
                    {contact.contact}
                  </div>
                ))}
              </Td>
              <Td>{user.course}</Td>
              <Td>{user.batch}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </main>
  );
};

export default DataPage;