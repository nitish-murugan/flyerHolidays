import { useState } from 'react';
import { FiPhone, FiMail, FiMapPin, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../api/axios';
import './ContactPage.css';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', travellers: 1 });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/enquiries', form);
      setSubmitted(true);
    } catch { alert('Something went wrong. Please try again.'); }
    setSubmitting(false);
  };

  return (
    <div>
      <div className="page-hero">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-tag">Get In Touch</span>
          <h1 className="section-title">Contact <span>Flyer Holidays</span></h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Ready to plan your dream trip? Our experts are here to help!
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '80px 24px' }}>
        <div className="contact-layout">
          <div className="contact-info">
            <h2>Let's Plan Your Adventure</h2>
            <p>Whether you have a destination in mind or need inspiration, our travel experts will craft the perfect itinerary just for you.</p>
            <div className="contact-cards">
              <a href="tel:+919876543210" className="contact-card">
                <div className="contact-icon"><FiPhone /></div>
                <div><strong>Call Us</strong><span>+91 98765 43210</span></div>
              </a>
              <a href="mailto:info@flyerholidays.com" className="contact-card">
                <div className="contact-icon"><FiMail /></div>
                <div><strong>Email Us</strong><span>info@flyerholidays.com</span></div>
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="contact-card whatsapp">
                <div className="contact-icon"><FaWhatsapp /></div>
                <div><strong>WhatsApp</strong><span>Chat with us instantly</span></div>
              </a>
              <div className="contact-card">
                <div className="contact-icon"><FiMapPin /></div>
                <div><strong>Visit Us</strong><span>Chennai, Tamil Nadu, India</span></div>
              </div>
            </div>
          </div>

          <div className="contact-form-wrap">
            {submitted ? (
              <div className="contact-success">
                <div className="success-icon"><FiSend /></div>
                <h3>Enquiry Received!</h3>
                <p>Thank you for reaching out! Our team will contact you within 24 hours to plan your perfect trip.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <h3>Send Us an Enquiry</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input required placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input required placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input required type="email" placeholder="john@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Number of Travellers</label>
                  <input type="number" min="1" placeholder="2" value={form.travellers} onChange={e => setForm({ ...form, travellers: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Your Message</label>
                  <textarea rows={5} placeholder="Tell us about your dream destination, travel dates, and any special requirements..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                </div>
                <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>
                  {submitting ? 'Sending...' : <><FiSend /> Send Enquiry</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
