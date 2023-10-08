import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Carousel from 'react-material-ui-carousel';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const VideoBox = styled(Box)({
  position: 'relative',
  '& video': {
    width: '100%',
    height: '100%',
    position: 'absolute',
    objectFit: 'cover',
    zIndex: 0,
    filter: 'brightness(80%)',
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    opacity: 0.8,
    backgroundImage: `url(/Images/combine.jpg)`,
    filter: 'brightness(50%)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
  },
});

const CaptionBox = styled(Stack)({
  zIndex: 1,
  position: 'relative',
  textAlign: 'center',
});

const featuredCrops = [
  {
    name: 'Wheat',
    image: '/Images/wheat.jpg',
    link: '/crops/rabi',
    description:
      "Wheat is one of the world's most widely cultivated cereal crops, known for its versatile culinary uses and nutritional value. It is a grass plant that produces grains that are ground into flour to make various products, including bread, pasta, and pastries.",
  },
  {
    name: 'Rice',
    image: '/Images/rice.jpg',
    link: '/crops/kharif',
    description:
      "Rice, a staple crop for more than half of the world's population, is a versatile and highly valued cereal grain. Cultivated in flooded fields or paddies, rice thrives in diverse climates and plays a crucial role in global food security. Its grains, when cooked, provide a primary source of carbohydrates.",
  },
  {
    name: 'Watermelon',
    image: '/Images/watermelon.webp',
    link: '/crops/zaid',
    description:
      'Watermelon is a zaid (summer) crop, known for its rapid growth and suitability for warm climates. It is typically sown in the early summer months and harvested within a short time frame. This short cultivation period makes it a popular choice for farmers looking for a quick crop turnaround.',
  },
];

const items = [
  {
    image: '/Images/seema.jpg',
    name: 'Seema',
    message:
      '"I have been using FarmHub website for over a year now and it has been a game-changer for me. The website provides me with all information I need to make informed decisionsabout my crops, including weather forecasts, market prices, and information on fertilizers, seeds, machinery, etc. The user-friendly interface and option to use the website in different languages makes it more widely accesible"',
  },
  {
    image: '/Images/shivam.jpg',
    name: 'Shivam',
    message:
      '"I have been using FarmHub website for over a year now and it has been a game-changer for me. The website provides me with all information I need to make informed decisionsabout my crops, including weather forecasts, market prices, and information on fertilizers, seeds, machinery, etc. The user-friendly interface and option to use the website in different languages makes it more widely accesible"',
  },
  {
    image: '/Images/ramesh.jpg',
    name: 'Ramesh',
    message:
      '"I have been using FarmHub website for over a year now and it has been a game-changer for me. The website provides me with all information I need to make informed decisionsabout my crops, including weather forecasts, market prices, and information on fertilizers, seeds, machinery, etc. The user-friendly interface and option to use the website in different languages makes it more widely accesible"',
  },
  {
    image: '/Images/lala.jpg',
    name: 'Lala Ram',
    message:
      '"I have been using FarmHub website for over a year now and it has been a game-changer for me. The website provides me with all information I need to make informed decisionsabout my crops, including weather forecasts, market prices, and information on fertilizers, seeds, machinery, etc. The user-friendly interface and option to use the website in different languages makes it more widely accesible"',
  },
];

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = (index) => {
    setHoveredCard(index);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };
  return (
    <Box sx={{ mt: { xs: 6, sm: 8 } }}>
      <VideoBox
        minHeight="30em"
        height={{ xs: 'calc(100vh - 3rem)', md: 'calc(100vh - 4rem)' }}
      >
        {/* <video autoPlay muted loop>
                    <source
                        src="/Images/main-video.mp4"
                        type="video/mp4"
                    />
                </video> */}
        <CaptionBox
          alignItems="center"
          justifyContent="center"
          spacing={{ xs: 7, md: 5 }}
          minHeight="30em"
          height={{ xs: 'calc(100vh - 6rem)', md: 'calc(100vh - 8rem)' }}
        >
          <Box>
            <Typography
              variant="h1"
              fontSize={{ xs: '4rem', md: '6rem', xl: '8rem' }}
              fontFamily={'TimesNewRoman'}
              fontWeight="bold"
              color="secondary.main"
              display="inline"
              text-outline="1px black solid"
            >
              FARM
            </Typography>
            <Typography
              variant="h1"
              fontSize={{ xs: '4rem', md: '6rem', xl: '8rem' }}
              fontFamily={'TimesNewRoman'}
              fontWeight="bold"
              color="primary"
              display="inline"
            >
              HUB
            </Typography>
          </Box>
          <Typography
            variant="h4"
            fontSize={{ xs: '1.5rem', md: '1.75rem', xl: '2rem' }}
            fontFamily={'TimesNewRoman'}
            width={{ xs: '90%', md: '70%' }}
            color="primary"
            gutterBottom
          >
            "Investments in agriculture are the best weapons against hunger and
            poverty, and they have made life better for billions of people"
          </Typography>
          <Stack direction="row" spacing="3vw">
            <Button
              component={Link}
              to="/shop"
              variant="contained"
              color="homeBtn"
              mr={2}
              sx={{ width: '11rem' }}
            >
              SEE ALL PRODUCTS
            </Button>
            <Button
              component={Link}
              to="/about-us"
              variant="contained"
              color="primary"
              sx={{ width: '11rem' }}
            >
              ABOUT US
            </Button>
          </Stack>
        </CaptionBox>
      </VideoBox>

      <Container maxWidth="lg">
        <Typography
          mt={8}
          variant="h4"
          fontWeight="500"
          textAlign="center"
          color="tertiary"
          mb={3}
        >
          Top Profitable Crops
        </Typography>
        <Grid container spacing={4}>
          {featuredCrops.map((crop, index) => (
            <Grid item xs={12} sm={6} md={4} key={crop.name}>
              <Card
                sx={{
                  width: '100%',
                  height: '18rem',
                  position: 'relative',
                  borderRadius: '1rem',
                  // cursor: 'pointer',
                  overflow: 'hidden',
                  transition: 'transform 0.4s ease-in-out',
                  boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.5)',
                  '&:hover': {
                    transform: 'translateY(20px)',
                    boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.5)',
                  },
                }}
                // component={Link}
                // to={crop.link}
                key={crop.name}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <CardMedia
                  component="img"
                  width="100%"
                  height="100%"
                  image={crop.image}
                  alt="Wheat"
                  sx={{
                    objectFit: 'cover',
                  }}
                />
                <div
                  className="info-overlay"
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    color: '#fff',
                    padding: '16px',
                    transition:
                      'transform 0.4s ease-in-out, height 0.4s ease-in-out',
                    height: hoveredCard === index ? '90%' : '12%',

                    overflow: 'hidden',
                    opacity: hoveredCard === index ? 0.8 : 0.9,
                    backdropFilter:
                      hoveredCard === index ? 'blur(4px)' : 'blur(5px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h5" color="primary">
                    {crop.name}
                  </Typography>
                  {hoveredCard === index && (
                    <div
                      style={{
                        marginTop: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        userSelect: 'none',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ marginBottom: '24px', textAlign: 'justify' }}
                      >
                        {crop.description}
                      </Typography>
                      <Button
                        component={Link}
                        to={crop.link}
                        variant={isHovered ? 'outlined' : 'contained'}
                        color="primary"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        sx={{
                          width: '8rem',
                        }}
                      >
                        Read More
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Typography
          mt={8}
          variant="h4"
          fontWeight="500"
          textAlign="center"
          color="tertiary"
        >
          Testimonials
        </Typography>
        <Carousel
          animation="slide"
          indicatorIconButtonProps={{
            style: {
              color: 'white',
            },
          }}
          activeIndicatorIconButtonProps={{
            style: {
              color: '#07412B', // 2
            },
          }}
          indicatorContainerProps={{
            style: {
              position: 'absolute',
              bottom: '1em',
              right: '2em',
              width: 'fit-content',
              zIndex: 1,
            },
          }}
          sx={{
            position: 'relative',
            width: { md: '80%' },
            height: { xs: '40rem', md: '20rem' },
            m: 'auto',
            mt: 3,
            borderRadius: '1em',
          }}
        >
          {items.map((item) => (
            <Card
              key={item.name}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                height: { xs: '100%', md: '20rem' },
                pb: { xs: 4, md: 0 },
                backgroundColor: 'tertiary.main',
                color: 'white',
              }}
            >
              <Box
                display={{ xs: 'none', md: 'flex' }}
                width="70rem"
                height="100%"
              >
                <CardMedia
                  component="img"
                  width="100%"
                  height="100%"
                  image={item.image}
                  sx={{ objectFit: 'cover' }}
                  alt="Live from space album cover"
                />
              </Box>
              <Avatar
                src={item.image}
                sx={{
                  display: { md: 'none' },
                  width: '5rem',
                  height: '5rem',
                  mt: 4,
                }}
                alt="avatar"
              />
              <Typography
                display={{ xs: 'block', md: 'none' }}
                textAlign="center"
                component="div"
                variant="h6"
                mt={3}
              >
                {item.name}
              </Typography>
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="subtitle1"
                  fontSize="1.1rem"
                  component="div"
                >
                  {item.message}
                </Typography>
                <Typography
                  display={{ xs: 'none', md: 'block' }}
                  component="div"
                  variant="h6"
                  mt={3}
                >
                  {item.name}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Carousel>
      </Container>
    </Box>
  );
}
