import React, { useState } from "react";
import { Tabs } from "antd";
import SearchBar from "../components/SearchBar";
import GroupCard from "./Groups/GroupCard";
import NewsroomCard from "./NewsRooms/NewsroomCard";
import UserProfileCard from "../components/UserProfileCard";

import {
  searchGroups,
  searchNewsrooms,
  searchUsers,
} from "../services/GroupController"; // Extend for newsrooms/users

const SearchListPage = () => {
  const [groups, setGroups] = useState([]);
  const [newsrooms, setNewsrooms] = useState([]);
  const [users, setUsers] = useState([]);

  const handleSearch = (query) => {
    searchGroups(query).then(setGroups);
    searchNewsrooms(query).then(setNewsrooms);
    searchUsers(query).then(setUsers);
  };

  const tabs = [
    {
      key: "groups",
      label: "Groups",
      children: groups.map((group) => (
        <GroupCard key={group.id} group={group} />
      )),
    },
    {
      key: "newsrooms",
      label: "Newsrooms",
      children: newsrooms.map((newsroom) => (
        <NewsroomCard key={newsroom.id} newsroom={newsroom} />
      )),
    },
    {
      key: "users",
      label: "Users",
      children: users.map((user) => (
        <UserProfileCard key={user.id} user={user} />
      )),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search groups, newsrooms, or users..."
      />
      <Tabs items={tabs} />
    </div>
  );
};

export default SearchListPage;
