import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, ListGroup, Modal, Card } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaSearch } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

// Import Google Font
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const API_URL = 'http://localhost:5000/shopping-list';

const App = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(API_URL);
      setItems(response.data);
    } catch (error) {
      toast.error('Failed to fetch items. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        await axios.put(`${API_URL}/${editItem.id}`, { name, quantity });
        toast.success('Item updated successfully!');
      } else {
        await axios.post(API_URL, { name, quantity });
        toast.success('Item added successfully!');
      }
      setName('');
      setQuantity('');
      setEditItem(null);
      fetchItems();
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setName(item.name);
    setQuantity(item.quantity);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success('Item deleted successfully!');
      fetchItems();
    } catch (error) {
      toast.error('Failed to delete item. Please try again.');
    }
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleSearch = () => {
    const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    setItems(filteredItems);
    if (filteredItems.length === 0) {
      toast.info('No items found matching your search.');
    }
  };

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#f9f9f9' }}>
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Header Section - Amazon Style */}
      <header style={{ backgroundColor: '#232f3e', color: '#fff', padding: '10px 0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Container>
          <Row className="align-items-center">
            <Col md={2}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '600' }}>takeafew</h1>
            </Col>
            <Col md={6}>
              <Form inline className="d-flex justify-content-center">
                <Form.Control
                  type="text"
                  placeholder="Search your shopping list..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '70%', borderRadius: '4px 0 0 4px' }}
                />
                <Button variant="warning" onClick={handleSearch} style={{ borderRadius: '0 4px 4px 0', backgroundColor: '#ff9900', borderColor: '#ff9900' }}>
                  <FaSearch /> Search
                </Button>
              </Form>
            </Col>
            <Col md={4} className="text-end">
              <span style={{ marginRight: '20px' }}>Categories</span>
              <span>Account</span>
            </Col>
          </Row>
        </Container>
      </header>

      {/* Main Content */}
      <Container className="mt-4">
        <Row>
          {/* Add New Item Panel */}
          <Col md={12} className="mb-4">
            <Card className="p-4 shadow-sm" style={{ backgroundColor: '#fff' }}>
              <h4 className="mb-3" style={{ color: '#232f3e' }}>Add New Item</h4>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter item name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button type="submit" variant="warning" style={{ backgroundColor: '#ff9900', borderColor: '#ff9900', width: '100%' }}>
                  {editItem ? 'Update' : 'Add'} Item
                </Button>
              </Form>
            </Card>
          </Col>

          {/* Shopping List - Grid Layout */}
          <Col md={12}>
            <h4 style={{ color: '#232f3e', marginBottom: '20px' }}>View List of Items</h4>
            {items.length === 0 ? (
              <p className="text-muted text-center">No items yet. Start adding some!</p>
            ) : (
              <Row xs={1} md={2} lg={3} className="g-4">
                {items.map((item) => (
                  <Col key={item.id}>
                    <Card className="h-100 shadow-sm" style={{ border: '1px solid #ddd' }}>
                      <Card.Body>
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Text>
                          <strong>Quantity:</strong> {item.quantity}
                        </Card.Text>
                        <div className="d-flex justify-content-between">
                          <Button variant="info" size="sm" onClick={() => handleView(item)}>
                            <FaEye />
                          </Button>
                          <Button variant="warning" size="sm" onClick={() => handleEdit(item)}>
                            <FaEdit />
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
                            <FaTrash />
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>

      {/* View Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Item Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <>
              <p><strong>Name:</strong> {selectedItem.name}</p>
              <p><strong>Quantity:</strong> {selectedItem.quantity}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default App;