// @mui
import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import { Card, CardActionArea, Typography } from '@mui/material';
// utils
// components
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
}));

// ----------------------------------------------------------------------

AppWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string,
  total: PropTypes.string,
  subtitle: PropTypes.string,
  sx: PropTypes.object,
};

export default function AppWidgetSummary({ title, total, subtitle, icon, color = 'primary', sx, ...other }) {
  return (
    <Card
      sx={{
        py: 5,
        boxShadow: 0,
        textAlign: 'center',
        color: (theme) => theme.palette[color].darker,
        bgcolor: (theme) => theme.palette[color].lighter,
        ...sx,
      }}
      {...other}
    >


      <CardActionArea href={`https://nusmods.com/modules/${total.split(' ')[0]}`} target="_blank" rel="noopener noreferrer">
        <IconWrapperStyle
          sx={{
            color: (theme) => theme.palette[color].dark,
            backgroundImage: (theme) =>
              `linear-gradient(135deg, ${alpha(theme.palette[color].dark, 0)} 0%, ${alpha(
                theme.palette[color].dark,
                0.24
              )} 100%)`,
          }}
        >
          <Iconify icon={icon} width={24} height={24} />
        </IconWrapperStyle>

        <Typography variant="h3">{total.split(' ')[0]}</Typography>

        <Typography variant="subtitle1" sx={{ opacity: 0.72 }}>
          {title}
        </Typography>

        <Typography variant="subtitle2">{subtitle}</Typography>
      </CardActionArea>
      </Card>
  );
}
