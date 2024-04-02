import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';

export default function Filters({
    minPrice,
    maxPrice,
    setPriceRange,
    checkPriceRange,
    minRating,
    setMinRating,
    brands,
    checkedBrands,
    setCheckedBrands
}) {
    const ratings = [4, 3, 2, 1];

    return (
        <>
            <Typography variant='subtitle1' fontWeight='500'>Price Range</Typography>
            <Box display='flex' alignItems='center' mt={2}>
                <TextField
                    type='number'
                    size="small"
                    variant="outlined"
                    name='minPrice'
                    label='Min'
                    value={minPrice}
                    onChange={(event) => setPriceRange(event)}
                    onBlur={(event) => checkPriceRange(event)}
                />
                <Typography px={1} fontWeight='500'>-</Typography>
                <TextField
                    type='number'
                    size="small"
                    variant="outlined"
                    name='maxPrice'
                    label='Max'
                    value={maxPrice}
                    onChange={(event) => setPriceRange(event)}
                    onBlur={(event) => checkPriceRange(event)}
                />
            </Box>
            <Typography variant='subtitle1' fontWeight='500' mt={5}>Ratings</Typography>
            <FormGroup sx={{ mt: 1 }}>
                {ratings.map(rating => (
                    <FormControlLabel
                        key={rating}
                        sx={{ ml: 0 }}
                        control={
                            <Checkbox
                                checked={minRating === rating}
                                onChange={(event) => setMinRating(event, rating)}
                                color='tertiary'
                            />
                        }
                        label={<Rating name="read-only" value={rating} readOnly />} />
                ))}
            </FormGroup>
            {brands ?
                <>
                    <Typography variant='subtitle1' fontWeight='500' mt={5}>Brands</Typography>
                    <FormGroup sx={{ mt: 1 }}>
                        {brands.map(brand => (
                            <FormControlLabel
                                key={brand}
                                sx={{ ml: 0 }}
                                control={
                                    <Checkbox
                                        checked={checkedBrands?.includes(brand)}
                                        onChange={(event) => setCheckedBrands(event, brand)}
                                        color='tertiary'
                                    />
                                }
                                label={brand}
                            />
                        ))}
                    </FormGroup>
                </>
                : null}
        </>
    )
}