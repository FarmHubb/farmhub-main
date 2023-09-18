import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';

export default function Filters({
    priceRange,
    changePriceRange,
    ratings,
    checkPriceRange,
    checkedRating,
    changeCheckedRating,
    brands,
    checkedBrands,
    changeCheckedBrands
}) {
    return (
        <>
            <Typography variant='subtitle1' fontWeight='500'>Price Range</Typography>
            <Box display='flex' alignItems='center' mt={2}>
                <TextField
                    type='number'
                    size="small"
                    variant="outlined"
                    name='min'
                    label='Min'
                    value={priceRange.min}
                    onChange={(event) => changePriceRange(event)}
                    onBlur={(event) => checkPriceRange(event)}
                />
                <Typography px={1} fontWeight='500'>-</Typography>
                <TextField
                    type='number'
                    size="small"
                    variant="outlined"
                    name='max'
                    label='Max'
                    value={priceRange.max}
                    onChange={(event) => changePriceRange(event)}
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
                                checked={checkedRating.some(selected => selected === rating)}
                                onChange={(event) => changeCheckedRating(event, rating)}
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
                                        checked={checkedBrands.some(selected => selected === brand)}
                                        onChange={(event) => changeCheckedBrands(event, brand)}
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