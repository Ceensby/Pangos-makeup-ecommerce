import React, { useState } from 'react';
import {
    Box,
    Typography,
    Container,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// FAQ data array with all questions and answers
const faqData = [
    {
        id: 1,
        question: "What is Bongos Beauty?",
        answer: "Bongos Beauty is a beauty-focused digital platform established in 2021, offering a carefully curated selection of beauty products with a refined and modern aesthetic. We aim to provide a seamless online shopping experience that reflects quality, elegance, and innovation."
    },
    {
        id: 2,
        question: "How does the ordering process work?",
        answer: "Placing an order on Bongos Beauty is simple and intuitive. Once you select your desired products, you can complete your purchase securely through our checkout process. After your order is confirmed, you will receive an order confirmation with all relevant details."
    },
    {
        id: 3,
        question: "How long does shipping take?",
        answer: "Orders are processed shortly after confirmation and prepared with care. Shipping times may vary depending on location, but orders are typically delivered within a few business days. Estimated delivery details are provided during checkout."
    },
    {
        id: 4,
        question: "Do you offer international shipping?",
        answer: "Bongos Beauty is designed as a global-ready e-commerce experience. International shipping availability may vary depending on destination and will be clearly indicated during the checkout process."
    },
    {
        id: 5,
        question: "How can I track my order?",
        answer: "Once your order has been shipped, tracking information will be shared via email. This allows you to follow your order's journey and stay informed at every stage of delivery."
    },
    {
        id: 6,
        question: "Can I modify or cancel my order after placing it?",
        answer: "If your order has not yet entered the shipping process, modifications or cancellations may be possible. We recommend contacting support as soon as possible after placing your order."
    },
    {
        id: 7,
        question: "How has Bongos Beauty evolved since 2021?",
        answer: "Since its launch in 2021, Bongos Beauty has continuously evolved by refining its digital experience, expanding its product curation, and embracing innovation within the beauty e-commerce space. Growth and improvement remain central to our vision."
    },
    {
        id: 8,
        question: "Is shopping on Bongos Beauty secure?",
        answer: "Yes. Security and privacy are fundamental to our platform. Bongos Beauty uses secure technologies to protect user data and ensure safe transactions throughout the entire shopping experience."
    }
];

export default function FAQ() {
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ py: 4 }}>
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        color: 'primary.main',
                        mb: 4,
                        textAlign: 'center'
                    }}
                >
                    Frequently Asked Questions (FAQ)
                </Typography>

                <Box sx={{ mt: 3 }}>
                    {faqData.map((faq) => (
                        <Accordion
                            key={faq.id}
                            expanded={expanded === `panel${faq.id}`}
                            onChange={handleChange(`panel${faq.id}`)}
                            sx={{
                                mb: 2,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                                '&:before': {
                                    display: 'none',
                                },
                                '&.Mui-expanded': {
                                    margin: '0 0 16px 0',
                                },
                                borderRadius: '8px !important',
                                overflow: 'hidden'
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                                aria-controls={`panel${faq.id}-content`}
                                id={`panel${faq.id}-header`}
                                sx={{
                                    backgroundColor: '#fafafa',
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5',
                                    },
                                    '&.Mui-expanded': {
                                        backgroundColor: '#f0f0f0',
                                    },
                                    transition: 'background-color 0.2s',
                                    padding: '8px 16px',
                                    minHeight: '64px'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '1.05rem',
                                        color: 'text.primary',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <Box
                                        component="span"
                                        sx={{
                                            color: 'primary.main',
                                            fontWeight: 700,
                                            minWidth: '24px'
                                        }}
                                    >
                                        {faq.id}.
                                    </Box>
                                    {faq.question}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{
                                    padding: '20px 24px',
                                    backgroundColor: '#fff',
                                    borderTop: '1px solid #e0e0e0'
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: 'text.secondary',
                                        lineHeight: 1.7,
                                        fontSize: '0.95rem',
                                        pl: 4
                                    }}
                                >
                                    {faq.answer}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            </Box>
        </Container>
    );
}
