'use client';

// React Imports
import { useState, useEffect } from 'react';

// Next Imports
import { useParams } from 'next/navigation';

// Third-party Imports
import axios from 'axios';

// Component Imports
import OrderDetails from '@views/orders/details';

// Map backend paymentStatus to paymentStatus keys
const paymentStatusMap = {
  paid: 1,
  pending: 2,
  cancelled: 3,
  failed: 4,
};

// Valid status values from OrderDetailHeader
const validStatuses = ['Delivered', 'Out for Delivery', 'Ready to Pickup', 'Dispatched'];

export default function OrderDetailsPage() {
  const { id } = useParams(); // Get dynamic id from URL
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(`http://localhost:5001/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const order = response.data.data;
        if (!order) {
          throw new Error('Order not found');
        }

        // Log raw status for debugging
        console.log(response.data,"hiiiiii");

        // Map paymentStatus to numeric key
        const paymentStatusKey = paymentStatusMap[order.paymentStatus.toLowerCase()] || 2; // Default to "Pending" (2)

        // Capitalize status and validate
        // const rawStatus = order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending';
        // const formattedStatus = validStatuses.includes(rawStatus) ? rawStatus : 'Pending';

        // Format data for OrderDetails component
        const formattedData = {
          id: order._id, // e.g., "6808fdad9491417b2bc57d56"
          order: order.orderNumber, // e.g., "349"
          date: new Date(order.createdAt), // e.g., 2025-04-23
          time: new Date(order.createdAt).toLocaleTimeString(), // e.g., "2:48:13 PM"
          customer: order.shopkeeper?.name || 'Unknown', // e.g., "Jane Smith"
          email: order.shopkeeper?.email || '',
          phone: order.shopkeeper?.phone || '', // e.g., "+1 234 567 8900"
          address: order.shopkeeper?.address || '', // e.g., "123 Main St, City, Country"

          avatar: null, // Adjust if avatar data available
          status: order.status, // e.g., "Delivered" or "Pending"
          supplier: order.supplier?.name || 'Unknown', // e.g., "Jane Smith"
          products: order.products.map(item => ({
            product: item.product?.name || 'Unknown Product', // e.g., "aoisjs" or "Unknown Product"
            unit: item.product?.unit || '', // e.g., "pieces" or ""
            price: item.price || item.product?.price || 0, // e.g., 5.99 for first, 10 for second
            quantity: item.quantity || 0, // e.g., 1 or 2
          })) || [],
          totalAmount: order.totalAmount, // e.g., 109.9
          payment: paymentStatusKey, // e.g., 2 for "pending"
          paymentMethod: order.paymentMethod, // e.g., "bank_transfer"
          notes: order.notes, // e.g., "Urgent delivery required."
        };

        setOrderData(formattedData);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!orderData) return <div>Order not found</div>;

  // console.log('orderData in main page:', orderData);

  return <OrderDetails orderData={orderData} order={orderData.order} />;
}
