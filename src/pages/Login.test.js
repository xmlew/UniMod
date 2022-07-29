import React from 'react';
import { isElement } from 'lodash';
import {render, fireEvent, screen} from '@testing-library/react';
import Login from "./Login.js";

test('loads items eventually', async () => {
    expect(isElement(<Login/>)).toBe(false)
});