import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { Box, useTheme } from '@mui/material';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function ScatterPlot(){
  const theme = useTheme();
  const options = {
    animation: false,
    layout: { padding: 0 },
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: 'green',
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  const data = {
    datasets: [
      {
        label: 'A dataset',
        data: [{
          x: 2,
          y: 7
        }, {
          x: 1,
          y: 8
        }, {
          x: 8,
          y: 9
        }, {
          x: 3,
          y: 7
        }],
        backgroundColor: 'rgba(255, 99, 132, 1)',
      },
      {
        label: 'test 2',
        data: [{
          x: 10,
          y: 10
        }, {
          x: 5,
          y: 5
        }, {
          x: 20,
          y: 10
        }, {
          x: 3,
          y: 2
        }],
        backgroundColor: 'rgb(67,243,30)',
      },
    ],
  }

  return(
      <Box
          sx={{
            height: 300,
            maxWidth: 500,
            mt: 3
          }}>
        <Scatter
            options={options} data={data}
        />
      </Box>
  );

}