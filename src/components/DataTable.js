import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";

const columns = [
  { id: "essay", label: "Έκθεση", minWidth: 170 },
  { id: "num_words", label: "Αριθμός λέξεων", minWidth: 100 },
  {
    id: "num_errors",
    label: "Αριθμός λαθών",
    minWidth: 170,
    align: "right",
  },
  {
    id: "grade",
    label: "Βαθμός",
    minWidth: 170,
    align: "right",
  },
];

function createData(essay, num_words, num_errors, grade) {
  return { essay, num_words, num_errors, grade };
}

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
});

export default function DataTable({ role }) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getEssayData = () => {
    let temp_data = [];
    fetch("http://127.0.0.1:5000/essays/all")
      .then((res) => res.json())
      .then((essays) => {
        let essay_data = JSON.parse(JSON.stringify(essays));

        essay_data.map((essay) => {
          temp_data.push(
            createData(
              essay.essay,
              essay.num_words,
              essay.num_mistakes,
              essay.grade
            )
          );
        });
        setRows(temp_data);
        console.log(rows);
      });
  };

  useEffect(() => {
    //API CALL TO GET THE DATA
    getEssayData();
  }, []);

  return (
    <Paper className={classes.root} id="datatableid">
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
