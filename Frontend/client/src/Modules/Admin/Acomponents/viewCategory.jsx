import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

export default function ViewCategory() {
  const [category, setCategory] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:7000/category/getCategory")
      .then((res) => {
        setCategory(res.data.data || []);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const HandleDelete = (id) => {
    axios.delete(`http://localhost:7000/category/deleteCategoryById/${id}`)
      .then(() => {
        alert("Category deleted");
        setCategory(category.filter((item) => item._id !== id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.headerRow}>
        <div>
          <span style={styles.tag}>Admin Panel</span>
          <h2 style={styles.title}>
            <span style={{ color: '#D4714E' }}> Manage Categories</span>
          </h2>
        </div>
        <Button
          component={Link}
          to="/Admin/AddCategory"
          style={styles.addBtn}
        >
          + Add Category
        </Button>
      </div>

      <div style={styles.tableWrap}>
        <TableContainer component={Paper} elevation={0} style={styles.tableContainer}>
          <Table>
            <TableHead>
              <TableRow style={styles.tableHeadRow}>
                <TableCell style={styles.th}>#</TableCell>
                <TableCell style={styles.th}>Category Name</TableCell>
                <TableCell style={styles.th}>Description</TableCell>
                <TableCell style={styles.th} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {category.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" style={styles.emptyText}>
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                category.map((row, index) => (
                  <TableRow key={row._id} style={styles.tableRow}
                    onMouseEnter={e => e.currentTarget.style.background = '#FFF5EE'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  >
                    <TableCell style={styles.td}>{index + 1}</TableCell>
                    <TableCell style={{ ...styles.td, fontWeight: 600, color: '#412402' }}>
                      {row.categoryName}
                    </TableCell>
                    <TableCell style={{ ...styles.td, color: '#888' }}>
                      {row.description || '—'}
                    </TableCell>
                    <TableCell align="center" style={styles.td}>
                      <Button
                        component={Link}
                        to={`/Admin/UpdateCategory/${row._id}`}  // ✅ correct route with id
                        style={styles.editBtn}
                        size="small"
                      >
                        Update
                      </Button>
                      <Button
                        onClick={() => HandleDelete(row._id)}
                        style={styles.deleteBtn}
                        size="small"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    padding: '8px 4px',
    fontFamily: "'DM Sans', sans-serif",
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  tag: {
    display: 'inline-block',
    background: 'rgba(212,113,78,0.1)',
    border: '0.5px solid rgba(212,113,78,0.35)',
    borderRadius: 20,
    padding: '3px 12px',
    fontSize: 10,
    letterSpacing: '0.13em',
    textTransform: 'uppercase',
    color: '#993C1D',
    marginBottom: 8,
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 26,
    fontWeight: 700,
    color: '#412402',
    margin: 0,
  },
  addBtn: {
    background: 'linear-gradient(135deg, #D4714E, #EF9F27)',
    color: 'white',
    borderRadius: 10,
    padding: '10px 20px',
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    textTransform: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  tableWrap: {
    borderRadius: 14,
    overflow: 'hidden',
    border: '0.5px solid rgba(212,113,78,0.2)',
  },
  tableContainer: {
    background: 'white',
    borderRadius: 14,
  },
  tableHeadRow: {
    background: 'linear-gradient(135deg, #D4714E, #EF9F27)',
  },
  th: {
    color: 'white',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 600,
    fontSize: 13,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    borderBottom: 'none',
    padding: '14px 16px',
  },
  tableRow: {
    background: 'white',
    transition: 'background 0.2s',
    borderBottom: '0.5px solid rgba(212,113,78,0.1)',
  },
  td: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    padding: '13px 16px',
    borderBottom: '0.5px solid rgba(212,113,78,0.08)',
  },
  emptyText: {
    color: '#aaa',
    fontFamily: "'DM Sans', sans-serif",
    padding: '40px',
    fontSize: 14,
  },
  editBtn: {
    background: 'rgba(55,138,221,0.1)',
    color: '#185FA5',
    borderRadius: 8,
    padding: '6px 16px',
    fontSize: 12,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    textTransform: 'none',
    border: '0.5px solid rgba(55,138,221,0.3)',
    marginRight: 8,
    cursor: 'pointer',
  },
  deleteBtn: {
    background: 'rgba(226,75,74,0.08)',
    color: '#A32D2D',
    borderRadius: 8,
    padding: '6px 16px',
    fontSize: 12,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    textTransform: 'none',
    border: '0.5px solid rgba(226,75,74,0.25)',
    cursor: 'pointer',
  },
};