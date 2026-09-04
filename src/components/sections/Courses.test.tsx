import { render, screen } from '@testing-library/react';
import { Courses } from './Courses';
import type { Course } from '@/content/schema';

const inProgressCourse: Course = {
  title: 'AI Engineer Career Accelerator Program',
  provider: 'Hasoub',
  year: 2026,
  status: 'in-progress',
};

const completedCourse: Course = {
  title: 'Microservices Development & DevOps',
  provider: 'MS&T',
  year: 2025,
  status: 'completed',
  durationHours: 250,
  projectNote: 'Built Alert Hub microservices notification system',
};

describe('Courses', () => {
  it('renders "In progress" marker for in-progress course (Req 7.4)', () => {
    render(<Courses courses={[inProgressCourse]} />);
    expect(screen.getByText(/in progress/i)).toBeInTheDocument();
    expect(screen.queryByText('2026')).not.toBeInTheDocument();
  });

  it('renders year for completed course, not "In progress" (Req 7.3)', () => {
    render(<Courses courses={[completedCourse]} />);
    expect(screen.getByText('2025')).toBeInTheDocument();
    expect(screen.queryByText(/in progress/i)).not.toBeInTheDocument();
  });

  it('renders course title and provider (Req 7.3)', () => {
    render(<Courses courses={[completedCourse]} />);
    expect(
      screen.getByRole('heading', { name: 'Microservices Development & DevOps' }),
    ).toBeInTheDocument();
    expect(screen.getByText('MS&T')).toBeInTheDocument();
  });

  it('renders durationHours when present (Req 7.3)', () => {
    render(<Courses courses={[completedCourse]} />);
    expect(screen.getByText('250 hours')).toBeInTheDocument();
  });

  it('renders projectNote when present (Req 7.3)', () => {
    render(<Courses courses={[completedCourse]} />);
    expect(
      screen.getByText('Built Alert Hub microservices notification system'),
    ).toBeInTheDocument();
  });

  it('renders both entries from the spec seed data (Req 7.5)', () => {
    render(<Courses courses={[completedCourse, inProgressCourse]} />);
    expect(
      screen.getByRole('heading', { name: 'AI Engineer Career Accelerator Program' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Hasoub')).toBeInTheDocument();
    expect(screen.getByText(/in progress/i)).toBeInTheDocument();
    expect(screen.getByText('2025')).toBeInTheDocument();
  });

  it('omits durationHours and projectNote when absent (Req 7.3)', () => {
    render(<Courses courses={[inProgressCourse]} />);
    expect(screen.queryByText(/hours/i)).not.toBeInTheDocument();
  });
});
