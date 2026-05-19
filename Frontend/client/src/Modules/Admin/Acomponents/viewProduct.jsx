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

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Jost:wght@300;400;500;600&display=swap');

  .ap-root {
    min-height: 100vh;
    background: #f8f4f0;
    font-family: 'Jost', sans-serif;
    padding: 40px;
  }

  .ap-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 32px;
  }

  .ap-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 3.5px;
    text-transform: uppercase;
    color: #D4714E;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }

  .ap-eyebrow::before {
    content: '';
    display: inline-block;
    width: 20px;
    height: 1.5px;
    background: #D4714E;
  }

  .ap-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 40px;
    font-weight: 600;
    color: #2d1f17;
    line-height: 1;
    letter-spacing: -0.5px;
  }

  .ap-title em { font-style: italic; color: #D4714E; }

  .ap-count {
    background: rgba(212,113,78,0.1);
    border: 1px solid rgba(212,113,78,0.2);
    color: #D4714E;
    font-size: 13px;
    font-weight: 500;
    padding: 5px 14px;
    border-radius: 50px;
    margin-left: 12px;
    vertical-align: middle;
    position: relative;
    top: -6px;
  }

  /* Table wrapper */
  .ap-table-wrap {
    border-radius: 20px !important;
    overflow: hidden !important;
    box-shadow: 0 4px 24px rgba(180,100,60,0.08), 0 1px 4px rgba(0,0,0,0.04) !important;
    border: 1px solid #eee5df !important;
  }

  /* Head row */
  .ap-thead-row th {
    background: #2d1f17 !important;
    color: #f0e6df !important;
    font-family: 'Jost', sans-serif !important;
    font-size: 11px !important;
    font-weight: 600 !important;
    letter-spacing: 2.5px !important;
    text-transform: uppercase !important;
    padding: 18px 20px !important;
    border-bottom: none !important;
    white-space: nowrap;
  }

  /* Body rows */
  .ap-tbody-row {
    transition: background 0.15s;
  }

  .ap-tbody-row:hover {
    background: #fdf3ee !important;
  }

  .ap-tbody-row td {
    font-family: 'Jost', sans-serif !important;
    font-size: 14px !important;
    color: #4a3028 !important;
    padding: 18px 20px !important;
    border-bottom: 1px solid #f2e8e2 !important;
    vertical-align: middle !important;
  }

  /* Product name cell */
  .ap-name {
    font-weight: 600 !important;
    color: #2d1f17 !important;
    font-size: 15px !important;
    font-family: 'Cormorant Garamond', serif !important;
  }

  /* Price */
  .ap-price {
    font-family: 'Cormorant Garamond', serif !important;
    font-size: 18px !important;
    font-weight: 600 !important;
    color: #D4714E !important;
  }

  /* Category pill */
  .ap-cat {
    display: inline-block;
    background: rgba(212,113,78,0.1);
    border: 1px solid rgba(212,113,78,0.2);
    color: #D4714E;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 50px;
  }

  /* Qty badge */
  .ap-qty {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
  }

  .ap-qty-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  /* Product image */
  .ap-img {
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: 12px;
    border: 2px solid #f2e8e2;
    background: #fdf0e8;
    display: block;
  }

  .ap-img-placeholder {
    width: 64px;
    height: 64px;
    border-radius: 12px;
    background: #fdf0e8;
    border: 2px dashed #e8d5c4;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
  }

  /* Buttons */
  .ap-btn-update {
    font-family: 'Jost', sans-serif !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    letter-spacing: 0.5px !important;
    border-color: #D4714E !important;
    color: #D4714E !important;
    border-radius: 50px !important;
    padding: 5px 16px !important;
    text-transform: none !important;
    transition: all 0.18s !important;
  }

  .ap-btn-update:hover {
    background: #D4714E !important;
    color: #fff !important;
  }

  .ap-btn-delete {
    font-family: 'Jost', sans-serif !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    letter-spacing: 0.5px !important;
    border-color: #e05555 !important;
    color: #e05555 !important;
    border-radius: 50px !important;
    padding: 5px 16px !important;
    text-transform: none !important;
    margin-left: 8px !important;
    transition: all 0.18s !important;
  }

  .ap-btn-delete:hover {
    background: #e05555 !important;
    color: #fff !important;
  }

  /* Empty state */
  .ap-empty {
    text-align: center;
    padding: 60px 20px;
    color: #9b7b6a;
    font-size: 15px;
    font-weight: 300;
  }

  .ap-empty-icon {
    font-size: 40px;
    margin-bottom: 12px;
    display: block;
  }

  /* Description truncate */
  .ap-desc {
    max-width: 220px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #0a0a0a !important;
    font-size: 13px !important;
    font-weight: 300 !important;
  }
`;

function getQtyStyle(qty) {
  if (qty <= 0)  return { color: '#e05555', bg: '#ffeaea' };
  if (qty <= 5)  return { color: '#c07820', bg: '#fff3e0' };
  return { color: '#2e7d4f', bg: '#e6f9ee' };
}

export default function ViewProduct() {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:7000/product/getProducts")
      .then((res) => {
        setProduct(res.data.pdata || []);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const HandleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    axios.delete(`http://localhost:7000/product/deleteProduct/${id}`)
      .then(() => {
        setProduct(prev => prev.filter(item => item._id !== id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ap-root">

        {/* Header */}
        <div className="ap-header">
          <div>
            <p className="ap-eyebrow">Inventory</p>
            <h1 className="ap-title">
              Product <em>Management</em>
              <span className="ap-count">{product.length}</span>
            </h1>
          </div>
        </div>

        {/* Table */}
        <TableContainer component={Paper} className="ap-table-wrap">
          <Table>
            <TableHead>
              <TableRow className="ap-thead-row">
                <TableCell>#</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {product.length > 0 ? (
                product.map((row, idx) => {
                  const qty = Number(row.quantity);
                  const qtyStyle = getQtyStyle(qty);
                  const catName = typeof row.categoryId === 'object'
                    ? row.categoryId?.categoryName
                    : row.categoryId;

                  return (
                    <TableRow key={row._id} className="ap-tbody-row">

                      {/* Index */}
                      <TableCell style={{ color: '#c8a090', fontSize: '13px', width: '40px' }}>
                        {idx + 1}
                      </TableCell>

                      {/* Name */}
                      <TableCell className="ap-name">{row.name}</TableCell>

                      {/* Description */}
                      <TableCell>
                        <span className="ap-desc" title={row.description}>
                          {row.description}
                        </span>
                      </TableCell>

                      {/* Price */}
                      <TableCell className="ap-price">
                        ₹{Number(row.price).toLocaleString('en-IN')}
                      </TableCell>

                      {/* Quantity */}
                      <TableCell>
                        <span className="ap-qty">
                          <span
                            className="ap-qty-dot"
                            style={{ background: qtyStyle.color }}
                          />
                          <span style={{
                            background: qtyStyle.bg,
                            color: qtyStyle.color,
                            padding: '3px 10px',
                            borderRadius: '50px',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}>
                            {qty <= 0 ? 'Out of Stock' : `${qty} units`}
                          </span>
                        </span>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        {catName && <span className="ap-cat">{catName}</span>}
                      </TableCell>

                      {/* Image */}
                      <TableCell>
                        {row.productimage ? (
                          <img
                            className="ap-img"
                            src={`http://localhost:7000/uploads/${row.productimage}`}
                            alt={row.name}
                            onError={e => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          className="ap-img-placeholder"
                          style={{ display: row.productimage ? 'none' : 'flex' }}
                        >
                          🖼️
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <Button
                          variant="outlined"
                          className="ap-btn-update"
                          component={Link}
                          to={`/Admin/UpdateProduct/${row._id}`}
                        >
                          Update
                        </Button>
                        <Button
                          variant="outlined"
                          className="ap-btn-delete"
                          onClick={() => HandleDelete(row._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>

                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="ap-empty">
                      <span className="ap-empty-icon">📦</span>
                      No products found. Start by adding your first product.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

      </div>
    </>
  );
}
