import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const courses = [...Array(25)].map((_, index) => ({
  id: index,
  name: sample([
    "apple",
    "banana",
    "pear",
  ]),
  code: sample([
    "CS1010",
    "CS1101S",
    "CS1010E",
    "CS1010S",
  ]),
  faculty: sample([
    "CS",
    "BZA",
  ]),
}));

export default courses;