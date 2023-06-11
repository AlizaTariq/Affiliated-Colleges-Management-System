import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useNavigate, useSearchParams } from "react-router-dom";
import Login from "./Login";

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import axios from "axios";
// Create styles
const styles = StyleSheet.create({
  page: {
    padding: "40px 0px 40px 0px",
    border: "solid",
  },
  container: {
    fontSize: "11",
    display: "flex",
    // height:'3%',
    margin: "0px 40px 0px 40px",
    flexDirection: "row",
  },
  Description: {
    width: "80%",
    fontSize: "11",
    border: "solid",
    borderLeft: "0px",
    borderRight: "1px",
    borderBottom: "1px",
    height: "auto",
  },
  first_disc: {
    width: "80%",
    fontSize: "11",
    border: "solid",
    borderLeft: "0px",
    borderRight: "1px",
    borderTop: "1px",
    height: "auto",
    borderBottom: "1px",
  },
  MyRow: {
    fontWeight: "bold",
    border: "solid",
    borderLeft: "1px",
    borderRight: "1px",
    borderBottom: "1px",
    borderColor: "#00000",
    backgroundColor: "grey",
    width: "20%",
    fontSize: "11",
    padding: "2px",
  },
  First_Row: {
    border: "1px solid rgb(5, 5, 7)",
    backgroundColor: "grey",
    width: "20%",
    fontSize: "11",
    padding: "2px",
    fontWeight: "bold",
  },
  section: {
    margin: 10,
    padding: 10,
  },
  viewer: {
    //marginLeft: '1px', /* Same as the width of the sidebar */
    //padding: '0px 0px',
    width: "100%",
    // width: window.innerWidth, //the pdf viewer will take up all of the width and height
    height: window.innerHeight,
  },
  title:{
    width: '100%',
    fontSize:'18',
    border:'none',
    marginLeft:'8%',
    // marginRight:'20%',
    marginTop:'1px',
    height:'auto',
    marginBottom:'2%',
    fontWeight:'ultrabold',
    // margin:'auto'

  },
});
function FORMPDF() {
  const [set_data, course] = useState([]);
  const [searchparams] = useSearchParams();
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    const retrieve = async () => {
      const response = await axios.post("http://127.0.0.1:5000/send_data", {
        id: parseInt(searchparams.get("courseId")),
      });
      console.log(response.data);
      course(response.data);
    };
    retrieve();

    // window.open("/FORMPDF", "_blank");
  }, []);
  if (!accessToken) {
    return <Login />; // Render the Login component if access token doesn't exist
  }

  return (
    <PDFViewer style={styles.viewer} file={set_data[5]} title={set_data[5]}>
      <Document file={set_data[5]} title={set_data[5]} download>
        <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{set_data[4]} {set_data[5]}</Text>
          <View style={styles.container} key={set_data[0]}>
            <Text style={styles.First_Row}>Course Title </Text>
            <Text style={styles.first_disc}> {set_data[5]}</Text>
          </View>
          <View style={styles.container}>
            <Text style={styles.MyRow}>Course Code </Text>
            <Text style={styles.Description}> {set_data[4]} </Text>
          </View>
          <View style={styles.container}>
            <Text style={styles.MyRow}>Course Hours: </Text>
            <Text style={styles.Description}> {set_data[7]} </Text>
          </View>
          <View style={styles.container}>
            <Text style={styles.MyRow}>Degree: </Text>
            <Text style={styles.Description}> {set_data[1]}</Text>
          </View>
          <View style={styles.container}>
            <Text style={styles.MyRow}>Course Content: </Text>
            <Text style={styles.Description}> {set_data[9]}</Text>
          </View>
          <View style={styles.container}>
            <Text style={styles.MyRow}>Text Book/s: </Text>
            <Text style={styles.Description}>{set_data[8]}</Text>
          </View>
        </Page>
      </Document>
      {/* <iframe   /> */}
    </PDFViewer>
  );
}

export default FORMPDF;
