import { Doughnut } from 'react-chartjs-2';
import { Box, Card, CardContent, CardHeader, Divider, Typography, useTheme } from '@mui/material';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import PhoneIcon from '@mui/icons-material/Phone';
import TabletIcon from '@mui/icons-material/Tablet';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);


export const Pie = (props) => {
  const theme = useTheme();

  const data = {
    datasets: [
      {
        data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        backgroundColor: ['#3F51B5', '#e53935', '#FB8C00', '#0ff000',
          '#16dea0', '#5e10de', '#fb0069', '#ffc400',
          '#fb1500', '#f800ff',
        ],
        borderWidth: 8,
        borderColor: '#FFFFFF',
        hoverBorderColor: '#FFFFFF'
      }
    ],
    labels: ['BSIT', 'BSCE', 'BSCS', 'BSMT', 'BSBE', "BSBA", 'BSA', 'BEED', 'HRM', 'BSCRIM']
  };

  const options = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  const devices = [
    {
      title: 'BSIT',
      value: 10,
      color: '#3F51B5'
    },
    {
      title: 'BSCE',
      value: 10,
      color: '#E53935'
    },
    {
      title: 'BSMT',
      value: 10,
      color: '#FB8C00'
    },
    {
      title: 'BSBE',
      value: 10,
      color: '#0ff000'
    },
    {
      title: 'BSBA',
      value: 10,
      color: '#16dea0'
    },
    {
      title: 'BSA',
      value: 10,
      color: '#5e10de'
    },
    {
      title: 'BEED',
      value: 10,
      color: '#fb0069'
    },
    {
      title: 'HRM',
      value: 10,
      color: '#fb1500'
    },
    {
      title: 'BSCRIM',
      value: 10,
      color: '#f800ff'
    },

  ];
  return (
      <Card {...props}>
        <CardHeader title="Your Top 10 Recommended Courses" />
        <Divider />
        <CardContent>
          <Box
              sx={{
                height: 300,
                position: 'relative'
              }}
          >
            <Doughnut
                data={data}
                options={options}
            />
          </Box>
          <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                pt: 2
              }}
          >
            {devices.map(({
                            color,
                            title,
                            value
                          }) => (
                <Box
                    key={title}
                    sx={{
                      p: 1,
                      textAlign: 'center'
                    }}
                >
                  <Typography
                      color="textPrimary"
                      variant="caption"
                  >
                    {title} &nbsp;
                  </Typography>
                  <Typography
                      style={{ color }}
                      variant="subtitle3"
                  >
                    {value}
                    %
                  </Typography>
                </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
  );
};
