// @mui
import { Grid, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
// components
import Page from '../components/Page';
// sections
import {
  AppWidgetSummary,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

//  Array of Data
const studentModules = [
  {
    title: "Over Subscribed",
    total: "CS1010S"
  },
  {
    title: "Equal Supply & Demand",
    total: "CS1010E"
  },
  {
    title: "Under Subscribed",
    total: "CS1010"
  },
  {
    title: "Over Subscribed",
    total: "CS1101S"
  }
]

function Child(items) {
  if (items === []) {
    return <div>
            Loading...
          </div>
  }
  return items.map((module, i) => (
    <Grid key={i} item xs={12} sm={6} md={3}>
      <AppWidgetSummary title={module.title} total={module.total} icon={'ant-design:android-filled'} />
    </Grid>
  ))
}

export default function PopularModules() {
  const [items, setItems] = useState([]);
  const url = `https://unimod.herokuapp.com/`;

  useEffect(() => {
    let data = `https://unimod.herokuapp.com/courseData/`;
    data += 'Business-Analytics'
    fetch(data)
    .then(res => res.json())
    .then(data => {
      setItems(data);
    });
  }, url)

  return (
    <Page title="Popular Modules">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Popular Modules
        </Typography>
        <Grid container spacing={3}>
          { Child(items) }
        </Grid>

      </Container>
    </Page>
  );
}