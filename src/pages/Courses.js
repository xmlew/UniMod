import * as Yup from 'yup';

import { useFormik, Form, FormikProvider } from 'formik';
import { LoadingButton } from '@mui/lab';

import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  TextField,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  IconButton,
  InputAdornment,
  MenuItem,
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { CourseListHead, CourseListToolbar, CourseMoreMenu } from '../sections/@dashboard/course';
// mock
import COURSELIST from '../_mock/course';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Course Name', alignRight: false },
  { id: 'code', label: 'Course Code', alignRight: false },
  { id: 'faculty', label: 'Faculty', alignRight: false },
  { id: '' },
];


// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_course) => _course.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

//  Set intial usestate
export default function Course() {
  
  const CourseSchema = Yup.object().shape({
    course: Yup.string()
  });

  const formik = useFormik({
    initialValues: {
      course: '',
    },
    validationSchema: CourseSchema,
    onSubmit: (values) => {
      console.log(values.course)
      const data = {
        course: values.course,
      }
      
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
  
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

//  Logic behind selecting all clicks on dropbox
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = COURSELIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

//  Logic Behind the clicks on dropbox
  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - COURSELIST.length) : 0;

  const filteredCourses = applySortFilter(COURSELIST, getComparator(order, orderBy), filterName);

  const isCourseNotFound = filteredCourses.length === 0;

  return (
    <Page title="Course">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">
            Course
          </Typography>
        </Stack>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack direction="row" alignItems="center" mb={2}>
              <TextField
                fullWidth
                label="Input Course..."
                {...getFieldProps('course')}
                error={Boolean(touched.course && errors.course)}
                helperText={touched.course && errors.course}
              />
              <Button type = "submit" variant="contained" component={RouterLink} to="/dashboard/courses" startIcon={<Iconify icon="eva:plus-fill" />}>
                New Course
              </Button>
              <Button type = "submit" variant="contained" component={RouterLink} to="/dashboard/courses" startIcon={<Iconify icon="eva:minus-fill" />}>
                Delete Course
              </Button>
            </Stack>
          </Form>
        </FormikProvider>

        <Card>
          <CourseListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <CourseListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={COURSELIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredCourses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, faculty, code} = row;
                    const isItemSelected = selected.indexOf(name) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        faculty="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} />
                        </TableCell>
                        <TableCell align="left">{name}</TableCell>
                        <TableCell align="left">{code}</TableCell>
                        <TableCell align="left">{faculty}</TableCell>
                        <TableCell align="right">
                          <CourseMoreMenu />
                        </TableCell>
                        
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isCourseNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={COURSELIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}