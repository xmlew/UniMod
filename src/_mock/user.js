import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/static/mock-images/avatars/avatar_${index + 1}.jpg`,
  courseCode: sample([
    'CS1010S',
    'CS1101',
    'CS1010',
    'CS1010E',
    'CS2030',
    'CS2030C',
    'CS2040',
    'CS2040C',
    'CS3233'
  ]),
  courseName: sample(['coursename']),
  isVerified: faker.datatype.boolean(),
  status: sample(['active']),
  faculty: sample([
    'SOC'
  ]),
}));

export default users;
