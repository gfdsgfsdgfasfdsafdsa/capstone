import {
    Box, Card, CardContent,
    List, ListItem, ListItemText, Typography,
    Divider, Table, TableHead, TableRow, TableBody, TableCell,
    TableContainer, Button,
    Link as MuiLink,
} from "@mui/material";
import {DateTime} from "luxon";
import {useEffect, useState} from "react";
import CustomDialog from "../../CustomDialog";
import Alert from "../../Alert";
import Link from 'next/link'
import AlertCollapse from "../../AlertCollapse";
import AxiosInstance from "../../../utils/axiosInstance";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import axios from "axios";

export default function Result({ result, id }){

    const [openDialog, setOpenDialog] = useState(false)
    const [deleted, setDeleted] = useState({
        status: false,
        error: false,
    })
    const [loading, setLoading] = useState(false)


    const courseRecommendArranged = (course) => {
        if(!course) return []
        let data = []
        for(let i = 0; i < course.length; i++){
            if(!data){
                data.push({ id: course[i].id, course: course[i].rank, rank: course[i].rank })
            }else if(data && data[data.length-1]?.rank === course[i].rank){
                data[data.length-1].course += `${course[i].course}, `
            }else{
                data.push({ id: course[i].id, course: course[i].course+', ', rank: course[i].rank })
            }

        }
        return data
    }

    const onClickDeleteResult = async () => {
        setOpenDialog(false)
        setLoading(true)
        setDeleted({ error: false, status: false })
        if(!result?.student?.id){
            setDeleted({ error: true, status: false })
            setLoading(false)
        }else{
            await AxiosInstance.delete(`school/exam/student/results/${id}/`, {
                data: {
                    student_id: result?.student?.id
                }
            })
                .then(async (_r) => {
                    if(result?.video !== 'Disabled' && result?.video !== 'Enabled'){
                        try{
                            let accessToken = null
                            await axios.post('https://www.googleapis.com/oauth2/v4/token', {
                                "client_id": '1046398706985-kh1ef3qo4ntiqdef65n67ll822h8e39f.apps.googleusercontent.com',
                                "client_secret": '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',
                                "refresh_token": '1//04dTyJXtpfsMDCgYIARAAGAQSNwF-L9IrytHWCOblt6rVheKIIhoRzch4UJ6MONUWCp952SRppORX6wGE_j3B0FfvftailuwOQJY',
                                "grant_type": "refresh_token"
                            }, {
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).then((res) => {
                                accessToken = res.data.access_token
                            }).catch((_e) => {})
                            if(accessToken){
                                await axios.delete(`https://www.googleapis.com/drive/v3/files/${result?.video}`,
                                    {
                                        headers: {
                                            Authorization: `Bearer ${accessToken}`,
                                        }
                                    }).then((res) => {
                                }).catch((_e) => {})
                            }
                        }catch{}
                    }
                    setDeleted({ error: false, status: true })
                    setLoading(false)
                    setLoading(false)
                    setLoading(false)
                }).catch((_e) => {
                    setDeleted({ error: true, status: false })
                    setLoading(false)
                })
        }
    }

    function generatePDF() {

		const pdf = new jsPDF();

		let startX = 15;

		pdf.setProperties({
			title: `${result?.student?.name.toUpperCase()}`
		});

		pdf.setFontSize(20)
		pdf.setFont(undefined, 'bold').text("CourseMe", startX, 18)

		pdf.setFontSize(11)
		pdf.setFont(undefined, 'bold').text(`NAME: `, startX, 27);
		pdf.setFont(undefined, 'normal').text(`${result?.student?.name.toUpperCase()}`, startX+14, 27);

		pdf.setFont(undefined, 'bold').text(`DATE: `, startX, 34);
		pdf.setFont(undefined, 'normal').text(`${DateTime.fromISO(result?.date_taken).toFormat('LLL dd, yyyy').toUpperCase()}`, startX+14, 34);

		let spaceInfo = 48;

		pdf.setFontSize(13)
		pdf.setFont(undefined, 'bold').text(`STUDENT INFORMATION`, startX, spaceInfo);

		pdf.setFontSize(11)
		pdf.setFont(undefined, 'bold').text(`STRAND: `, startX, spaceInfo+8);
		pdf.setFont(undefined, 'normal').text(`${result?.student?.strand.toUpperCase()}`, startX+19, spaceInfo+8);

		pdf.setFont(undefined, 'bold').text(`AGE: `, startX, spaceInfo+15);
		pdf.setFont(undefined, 'normal').text(`${result?.student?.age.toString()}`, startX+11, spaceInfo+15);

		pdf.setFont(undefined, 'bold').text(`School from: `, startX, spaceInfo+22);
		pdf.setFont(undefined, 'normal').text(`${result?.student?.school.toUpperCase()}`, startX+26, spaceInfo+22);

		pdf.setFont(undefined, 'bold').text(`Gender: `, startX, spaceInfo+29);
		pdf.setFont(undefined, 'normal').text(`${result?.student?.gender.toUpperCase()}`, startX+17, spaceInfo+29);

		let spaceExam = spaceInfo+45;

		pdf.setFontSize(13)
		pdf.setFont(undefined, 'bold').text(`EXAM RESULT`, startX, spaceExam);

        let exam_a_score = []
        let exam_a_score_space = 0
        result?.result_details.map((s, i) => {
            exam_a_score_space += 2
            exam_a_score.push([s.subject, `${s.score}/${s.overall}`])
        })
        /*
        exam_a_score.push(['test', 'test'])
        exam_a_score.push(['test', 'test'])

         */

		autoTable(pdf, {
			theme: 'grid',
			startY: spaceExam+3,
			styles: {
				fontStyle: 'bold',
				textColor: 20,
				lineColor: 20,
			},
			body: [
                ['Subject', 'Score'],
                ...exam_a_score,
			],
			bodyStyles: { fontStyle: 'normal' },
			columnStyles: {
				0: { cellWidth: 80 },
			 },
            didParseCell(data) {
                if (data.row.index === 0) {
                    data.cell.styles.fontStyle = "bold";
                    data.cell.styles.fontSize = 11;
                }
            }
		})
        console.error = () => {};


		let spaceRecommendCourse = spaceExam+ 40 + exam_a_score_space*2;

		pdf.setFontSize(13);
		pdf.setFont(undefined, 'bold').text(`COURSE RECOMMENDED`, startX, spaceRecommendCourse);

        let additionalTblRow = 0, add = 0
        let coursesRecommended = courseRecommendArranged(result?.result_courses).map((d, i) => {
            if(d.course.length > 66){
                additionalTblRow += Math.round(d.course.length/66)
            }
            return [d.rank, d.course.substring(0, d.course.length - 2)]
        })

        if(coursesRecommended?.length){
            autoTable(pdf, {
                theme: 'grid',
                startY: spaceRecommendCourse+3,
                styles: {
                    fontStyle: 'bold',
                    textColor: 20,
                    lineColor: 20,
                },
                body: [
                    ['Rank', 'Courses'],
                    ...coursesRecommended
                ],
                headerStyles: { halign: 'left',},
                bodyStyles: { halign: 'left', fontStyle: 'normal' },
                columnStyles: { 1: { halign: 'left' } },
                didParseCell(data) {
                    if (data.row.index === 0) {
                        data.cell.styles.fontStyle = "bold";
                        data.cell.styles.fontSize = 11;
                    }
                }
            })
        }else{
            add += 10
            pdf.setFontSize(11);
            pdf.setFont(undefined, 'normal').text('UNABLE TO GENERATE RECOMMENDED COURSE', startX, spaceRecommendCourse+8);
        }
        if(coursesRecommended?.length <= 2){
            add += 10
        }else if (coursesRecommended?.length <= 3){
            add += 5
        }else if (coursesRecommended?.length <= 5){
            add += 0
        }else if (coursesRecommended?.length <= 7){
            add -= 4
        }else if (coursesRecommended?.length <= 10){
            add -= 10
        }

		let spaceRegression = spaceRecommendCourse + ((coursesRecommended?.length+1)*10) + additionalTblRow + add;

		pdf.setFontSize(13);
		pdf.setFont(undefined, 'bold').text(`REGRESSION MODEL`, startX, spaceRegression);

		pdf.setFontSize(11);
        pdf.setFont(undefined, 'normal').text(result?.formula.replaceAll("&beta;", "B"), startX, spaceRegression + 10);
        let regression = result?.regression_model.split('<br/>');
        let formula = regression[0].split('+')
        let display_formula = ''
        let j = 2
        formula.map((d, i) => {
            if(i === formula.length - 1){
                display_formula += d
            }else if(i === j){
                display_formula += '\r\n' + d + ' + '
                j+=2
            }else{
                display_formula += d + ' + '
            }
        })
        pdf.setFont(undefined, 'normal').text(`${display_formula}`, startX, spaceRegression + 20);
        pdf.setFont(undefined, 'normal').text(``, startX, spaceRegression + 30);
        pdf.setFont(undefined, 'normal').text(`${regression[1]}`, startX, spaceRegression + 35);

        return pdf
    }

    function previewPDF(){
        generatePDF().output('dataurlnewwindow')
    }

    function downloadPDF(){
        generatePDF().save('test.pdf')
    }

    return (
        <>
            <CustomDialog
                onClickConfirm={onClickDeleteResult}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                title={'Are you sure you want to delete this result?'}
                content={'By deleting this the, student will be able to apply again and take the exam.'}
            />
            {deleted.status ? (
                <Box
                    mt={3}
                    mb={1}
                >
                    <Alert text="Data has been deleted successfully."
                           condition={true}/>
                    <Box
                        mt={3}
                        ml={3}
                    >
                        <Typography
                            variant="cool"
                        >
                            Go back to &nbsp;
                            <Link href={`/s/results/`} passHref>
                                <MuiLink>
                                    Results
                                </MuiLink>
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            ): (
                <>
                    {loading && (
                        <Box
                            mt={1}
                        >
                            <AlertCollapse
                                severity="loading"
                                text={"Deleting data.."}
                                condition={true}
                            />
                        </Box>
                    )}
                    {deleted.error && (
                        <Box
                            mt={1}
                        >
                            <Alert text="Something went wrong please refresh the page."
                                   severity="error"
                                   condition={true}/>
                        </Box>
                    )}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between' ,
                            flexWrap: 'wrap',
                            alignItems: 'center'
                        }}
                        mt={1} mb={1}
                    >
                        <Typography variant="h4">
                            {result?.student.name}
                        </Typography>
                        <Box>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={downloadPDF}
                                sx={{ mr: 1 }}
                            >
                                Download PDF
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={previewPDF}
                                sx={{ mr: 1 }}
                            >
                                PDF Preview
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                color="error"
                                disabled={loading}
                                onClick={() => setOpenDialog(true)}
                            >
                                Delete Result
                            </Button>
                        </Box>
                    </Box>
                    <Typography variant="body2" mb={3}>
                        Date taken: &nbsp;
                        {DateTime.fromISO(result?.date_taken).toFormat('LLL dd, yyyy')}
                    </Typography>
                    <Card>
                        <CardContent
                            sx={{
                                padding: 0,
                                '&:last-child': {
                                    paddingBottom: 0,
                                }
                            }}>
                            <Box sx={{ padding: '12px 24px' }}>
                                <Typography variant="cool">
                                    Student Information
                                </Typography>
                            </Box>
                            <Divider/>
                            <List sx={{ padding: 0 }}>
                                <ListItem sx={{ padding: '2px 24px' }}>
                                    <ListItemText primary={
                                        <Box sx={{ display: 'flex', flex: '1 1 auto' }}>
                                            <Typography
                                                sx={{ minWidth: '180px' }}
                                                component="span"
                                                variant="subtitle2">
                                                Strand
                                            </Typography>
                                            <Box>
                                                <Typography
                                                    component="span"
                                                    sx={{ color: '#657896' }}
                                                    variant="body2">
                                                    {result?.student.strand}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    } />
                                </ListItem>
                                <Divider/>
                                <ListItem sx={{ padding: '2px 24px' }}>
                                    <ListItemText primary={
                                        <Box sx={{ display: 'flex', flex: '1 1 auto' }}>
                                            <Typography
                                                sx={{ minWidth: '180px' }}
                                                component="span"
                                                variant="subtitle2"
                                            >
                                                Age
                                            </Typography>
                                            <Box>
                                                <Typography
                                                    component="span"
                                                    sx={{ color: '#657896' }}
                                                    variant="body2">
                                                    {result?.student.age}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    } />
                                </ListItem>
                                <Divider/>
                                <ListItem sx={{ padding: '2px 24px' }}>
                                    <ListItemText primary={
                                        <Box sx={{ display: 'flex', flex: '1 1 auto' }}>
                                            <Typography
                                                sx={{ minWidth: '180px' }}
                                                component="span"
                                                variant="subtitle2">
                                                School from
                                            </Typography>
                                            <Box>
                                                <Typography
                                                    component="span"
                                                    sx={{ color: '#657896' }}
                                                    variant="body2">
                                                    {result?.student.school}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    } />
                                </ListItem>
                                <Divider/>
                                <ListItem sx={{ padding: '2px 24px' }}>
                                    <ListItemText primary={
                                        <Box sx={{ display: 'flex', flex: '1 1 auto' }}>
                                            <Typography
                                                sx={{ minWidth: '180px' }}
                                                component="span"
                                                variant="subtitle2">
                                                Gender
                                            </Typography>
                                            <Box>
                                                <Typography
                                                    component="span"
                                                    sx={{ color: '#657896' }}
                                                    variant="body2">
                                                    {result?.student.gender}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    } />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                    <Card sx={{ marginTop: '20px' }}>
                        <CardContent sx={{ padding: '12px 24px' }}>
                            <Typography variant="cool">
                                Exam Result
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ ml: 1 }}
                            >
                                No. of times user switched tab: {result?.tab_switch}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ ml: 1 }}
                            >
                                Video Link:
                                &nbsp;
                                {result?.video === 'Disabled' || result?.video === 'Enabled' || result?.video === 'None' ? (
                                    <>
                                        {result?.video === 'Disabled' && (
                                            'Disabled'
                                        )}
                                        {result?.video === 'Enabled' && (
                                            'Unable to Save Video'
                                        )}
                                        {result?.video === 'None' && (
                                            'N/A'
                                        )}
                                    </>
                                ):(
                                    <MuiLink
                                        href={`https://drive.google.com/file/d/${result?.video}/view`}
                                        target="_blank"
                                        color="primary"
                                        variant="overline"
                                    >
                                        {`https://drive.google.com/file/d/${result?.video}/view`}
                                    </MuiLink>
                                )}
                            </Typography>
                            <TableContainer sx={{ marginTop: '10px' }}>
                                <Table sx={{ minWidth: 300 }} size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ maxWidth: 10 }}>
                                                Subject
                                            </TableCell>
                                            <TableCell align="left">
                                                Score
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {result?.result_details.map((s, i) => (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    {s.subject}
                                                </TableCell>
                                                <TableCell>
                                                    {s.score} / {s.overall}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                    <Card sx={{ marginTop: '20px' }}>
                        <CardContent sx={{ padding: '12px 24px' }}>
                            <Typography variant="cool">
                                Course Recommended
                            </Typography>
                            <Box>
                                <Typography variant="caption" mb={2}>
                                    Same no. in ranking has no particular order
                                </Typography>
                            </Box>
                            {result?.result_courses?.length === 0 ? (
                                <Box sx={{ pl: 5, mt: 2 }}>
                                    <Typography variant="body2" mb={2}>
                                        Unable to get result due to score.
                                    </Typography>
                                </Box>
                            ): (
                                <TableContainer sx={{ marginTop: '10px' }}>
                                    <Table sx={{ minWidth: 300 }} size="small" aria-label="a dense table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ width: 150 }}>
                                                    Rank
                                                </TableCell>
                                                <TableCell align="left">
                                                    Course
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {courseRecommendArranged(result?.result_courses).map((d, i) => (
                                                <TableRow key={d.id}>
                                                    <TableCell sx={{ pl: 4 }}>
                                                        {d.rank}
                                                    </TableCell>
                                                    <TableCell>
                                                        {d.course.substring(0, d.course.length - 2)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {/*result?.result_courses.map((d, i) => (
                                            <Box key={d.id} sx={{ pl: 5 }}>
                                                <Typography variant="cool" mb={2}>
                                                    {d.rank} <span style={{ marginLeft: '10px' }}>{d.course}</span>
                                                </Typography>
                                            </Box>
                                        ))*/}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </CardContent>
                    </Card>
                    <Box mt={3} pb={10} ml={2}>
                        {/*
                        <Box>
                            <Typography variant="cool" mb={2}>
                                Course Recommended
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" mb={2}>
                                Same no. in ranking has no particular order
                            </Typography>
                        </Box>
                        */}
                        <Box>
                            <Typography variant="cool" mb={2}>
                                Regression model
                            </Typography>
                        </Box>
                        <Box sx={{ ml: 3 }}>
                            <Box mt={1}>
                                <Typography
                                    sx={{
                                        fontSize: '15px',
                                    }}
                                    component="div"
                                >
                                    <div dangerouslySetInnerHTML={{ __html: result?.formula }}/>
                                </Typography>
                            </Box>
                            <Typography
                                mt={1}
                                sx={{
                                    fontSize: '15px'
                                }}
                                component="div"
                            >
                                <div dangerouslySetInnerHTML={{ __html: result?.regression_model }}/>
                            </Typography>
                        </Box>
                    </Box>
                </>
            )}
        </>
    )
}