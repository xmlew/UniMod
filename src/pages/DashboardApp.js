// @mui
import { Grid, Container, Typography } from '@mui/material';
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



export default function DashboardApp() {

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>
        <Grid container spacing={3}>
        {studentModules.map((module, i) => (
          <Grid key={i} item xs={12} sm={6} md={3}>
            <AppWidgetSummary title={module.title} total={module.total} icon={'ant-design:android-filled'} />
          </Grid>
        ))}
        </Grid>

      </Container>
    </Page>
  );
}
