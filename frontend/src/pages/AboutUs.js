import React from 'react';
import { Box, Typography, Container } from '@mui/material';

export default function AboutUs() {
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
                        mb: 3
                    }}
                >
                    About Us
                </Typography>

                <Box sx={{ lineHeight: 1.8, color: 'text.primary' }}>
                    <Typography variant="body1" paragraph>
                        Bongos was founded in 2021 with the vision of becoming an inspiring brand for everyone who sees beauty and fashion as a lifestyle. Since our establishment, we have aimed to create a distinctive presence in the beauty and fashion world by combining our aesthetic perspective with an innovative approach.
                    </Typography>

                    <Typography variant="body1" paragraph>
                        At Bongos, we believe that beauty cannot be limited to a single definition and that fashion is one of the most powerful ways of self-expression. For this reason, we prioritize originality, creativity, and timeless elegance in every collection and every selection we offer. Our goal is to connect our users with products that help them feel confident and express their personal style boldly.
                    </Typography>

                    <Typography variant="body1" paragraph>
                        While closely following trends in the beauty industry, we blend modern lines with classic touches in the world of fashion. Bongos is not just a brand that offers products; it is also a platform that inspires, encourages discovery, and accompanies you on your style journey.
                    </Typography>

                    <Typography variant="body1" paragraph>
                        Quality, attention to detail, and user experience are among our core values. Everything at Bongos is shaped by a simple yet striking aesthetic approach, because we believe true beauty lies in the details.
                    </Typography>

                    <Typography variant="body1" paragraph>
                        As the growing Bongos family since 2021, we are proud to stand alongside everyone who expresses themselves with confidence and embraces their unique style in the beauty and fashion world.
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}
