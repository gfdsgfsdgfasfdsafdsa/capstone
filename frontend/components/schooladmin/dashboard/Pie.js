import { Doughnut } from 'react-chartjs-2';
import { Box, Card, CardContent, CardHeader, Divider, Typography, useTheme } from '@mui/material';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import PhoneIcon from '@mui/icons-material/Phone';
import TabletIcon from '@mui/icons-material/Tablet';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

export const Pie = ({ courseRank }) => {
  const theme = useTheme();
  let bgColors = [
      '#3F51B5', '#e53935', '#FB8C00', '#0ff000',
      '#16dea0', '#5e10de', '#fb0069', '#ffc400',
      '#fb1500', '#f800ff', "#00ffc1", "#ad4b47",
      '#7e5757', '#8937c4', '#063041', '#094b03',
      '#3a3030', '#011000', "#0e2a65", "#4b48a9",
  ]

  const data = {
    datasets: [
      {
        data: courseRank?.map((name) => {
          return name.c
        }),
        backgroundColor: bgColors,
        borderWidth: 8,
        borderColor: '#FFFFFF',
        hoverBorderColor: '#FFFFFF'
      }
    ],
    labels: courseRank?.map((name) => {
      return name.course
    }),
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

  let i = -1
  const courseList = [
      ...courseRank?.map((x) => {
          i++;
          if(i >= bgColors.length)
              i = 0
          return { title: x.course, value: x.c, color: bgColors[i]}
      }),
  ];
  return (
      <Card>
        <CardHeader title="Most Recommended Courses" />
        <Divider />
        <CardContent>
          <Box
              sx={{
                height: 300,
                position: 'relative'
              }}
          >
              {courseList?.length === 0 && (
                  <Typography textAlign="center">
                      No data
                  </Typography>
              )}
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
            {courseList.map(({
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
