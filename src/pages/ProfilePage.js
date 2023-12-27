import { useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Iconify from "~/components/iconify";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { FormChangePassword, FormProfile } from "~/sections/@dashboard/profile";

function TabPanel(props) {
  const { value, index, user, ...other } = props;
  return (
    <>
      <Helmet>
        <title>Profile | Pet Shop</title>
      </Helmet>
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
        style={{ flex:"auto" }}
      >
        {value === 0 && (
          <FormProfile user={user} />
        )}
        {value === 1 && (
          <FormChangePassword />
        )}
      </div>
    </>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`
  };
}

export default function ProfilePage() {
  const [value, setValue] = useState(0);
  const { user } = useSelector(state => state.user);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: "background.paper", display: "flex", height: 500 }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        <Tab label="Thông tin cá nhân" {...a11yProps(0)} icon={<Iconify icon={"eva:person-fill"} />}
          iconPosition="start"
        />
        <Tab label="Thay đổi mật khẩu" {...a11yProps(1)}
          icon={<Iconify icon={"mdi:password"} />}
          iconPosition="start"
        />
      </Tabs>
      <TabPanel value={value} index={0} user={user} />
      <TabPanel value={value} index={1} />

    </Box>
  );
}