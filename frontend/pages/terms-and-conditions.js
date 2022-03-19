import {Box, Container, Typography} from "@mui/material";
import { sessionRoutes } from '../helpers/index'
import Head from 'next/head';

export default function TermsAndConditions(){
    return(
        <Box>
            <Head>
                <title>
                    Terms And Conditions
                </title>
            </Head>
            <Box sx={{ height: '65px', backgroundColor: '#1F2937', display: 'flex', alignItems: 'center' }}>
                <Container maxWidth="md">
                    <Typography color="white" variant="h5">
                        Course Me: Terms And Conditions
                    </Typography>
                </Container>
            </Box>
            <Container maxWidth="md" sx={{ py: 3 }}>
                <Typography variant="h4">
                    Privacy Policy
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, textAlign: 'justify' }}>
                    CourseMe (Course Recommendation for K-12 Students Using Multiple-Regression Based on Online Entrance Exam) values and respects your right to privacy. We are committed to protect the privacy of our respondents. We will only collect, record, store, process, and use your personal information in accordance with the Data Privacy Act of 2012, its Implementing Rules and Regulations, the issuances by the National Privacy Commission, and other pertinent laws.
                    This Privacy Policy informs you of updates in our corporate policies regarding the collection, use, storage, disclosure, and disposal of personal information we receive and collect from our customers, and any individual who communicates, raises inquiries and concerns, as well as transacts with us through our authorized representatives.
                    We will only use your data based on the limitations set by this policy. The outline below provides the manner by which we manage the personal information that we will obtain from you if you visit our website.
                </Typography>
                <Typography variant="h4" sx={{ mt: 2}}>
                    Personal Information
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, textAlign: 'justify' }}>
                    Personal Information refers to any information, whether recorded in a material form or not, from which the identity of an individual is apparent or can be reasonably and directly ascertained by the entity holding the information, or when put together with other information would directly and certainly identify an individual. Sensitive Personal Information is any attribute of your personal information that can discriminate, qualify, or classify you such as your age, date of birth, marital status, government-issued identification numbers, account numbers, and financial information. Privileged Information is any and all forms of information which, under the Rules of Court and other pertinent laws, constitute privileged communication.
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    Under the Data Privacy Act of 2012, you have the following rights:
                </Typography>
                <Typography variant="body1" sx={{ ml: 3 }}>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        1.	Right to be informed – you may request the details as to how your personal information is being processed or have been processed by the Company, including the existence of automated decision-making and profiling systems;
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        2.	 Right to access – upon written request, you may demand reasonable access to your personal information, which may include the contents of your processed personal information, the manner of processing, sources where they were obtained, recipients and reason of disclosure;
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        3.	Right to dispute – you may dispute inaccuracy or error in your personal information in the Company systems through our contact center representatives;
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        4.	Right to object – you may suspend, withdraw, and remove your personal information in certain further processing, upon demand, which include your right to opt-out to any commercial communication or advertising purposes from the Company;
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        5.	Right to data erasure – based on reasonable grounds, you have the right to suspend, withdraw or order the blocking, removal or destruction of your personal data from the Company’s filing system;
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        6.	Right to secure data portability – you have the right to obtain from the Company your personal information in an electronic or structured format that is commonly used and allows for further use;
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        7.	Right to be indemnified for damages – as data subject, you have every right to be indemnified for any damages sustained due to such violation of your right to privacy through inaccurate, false, unlawfully obtained or unauthorized use of your information; and
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        8.	Right to file a complaint – you may file your complaint or any concerns with our legal compliance division: coursemeproject@gmail.com
                    </Typography>
                </Typography>
                <Typography variant="h4" sx={{ mt: 2}}>
                    Collection of Personal Information
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    We collect the following categories of Personal Data about Site visitors, clients, prospective clients, and other third parties:
                </Typography>
                <Typography variant="body1" sx={{ ml: 3 }}>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        1.	Device data: Computer Internet Protocol (IP) address, unique device identifier (UDID), cookies and other data linked to a device, and data about usage of our website (Usage Data)
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        2.	Basic and Client Service data: Name, gender, school, strand, phone number, email address, and contact details;
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        3.	Social Media data: Pictures, gender, date of birth, relationship status, interests and hobbies, educational background, or any other matters which are readily accessible if you link your account with our website;
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        4.	Transaction data: Personal data contained in documents, correspondence or other material provided by or relating to transactions conducted with or by our respondents.
                    </Typography>
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, textAlign: 'justify' }}>
                    We will only collect your personal information if you voluntarily submit the information to us. If you choose not to submit your personal information to us or subsequently withdraw your consent to our use of your personal information, we may not be able to adequately respond to your inquiries or avail of our services.
                    When we receive data from our respondents, the respondent is responsible for ensuring that any such data is transferred to us in compliance with applicable data protection laws.
                </Typography>
                <Typography variant="h4" sx={{ mt: 2}}>
                    Use of Personal Data
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    The purposes for which we use Personal Data are as follows:
                </Typography>
                <Typography variant="body1" sx={{ ml: 3 }}>
                    <Typography sx={{ mt: 2 }}>
                        1.	To provide consultation advice and respond to inquiries. For this, we use basic and client service data, transaction, and device data.
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        2.	To manage our business operations, the website, and our client relationships. For this, we use basic and client service data, registration data, and marketing data.
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        3.	To make our Site intuitive and easy to use. For this, we use device data. It is necessary for our legitimate interests to monitor how our Site is used to help us improve the layout and information available on our website and provide a better service to our website users.
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        4.	To protect the security and effective functioning of our website and information technology systems. For this, we use basic and client service data, registration data, transaction data, and device data. It is necessary for our legitimate interests to monitor how our website is used to detect and prevent fraud, other crimes and the misuse of our website. This helps us to ensure that you can safely use our website.
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        5.	To provide relevant marketing, such as providing you with information about events or services that may be of interest to you including services, updates, client conferences or networking events, and groups of specific interest. For this, we use registration and marketing data, basic and client service data, as well as device data. It is necessary for our legitimate interests to process this information in order to provide you with tailored and relevant marketing, updates and invitations.
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        6.	To address compliance and legal obligations, such as complying with the Firm’s reporting obligations, checking the identity of new clients and to prevent money laundering and/or fraud. For this, we use compliance data, basic and client service data, registration data, transaction data, and device data.
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        7.	To consider individuals for employment and contractor opportunities and manage on-boarding procedures. For this, we use job applicant data and compliance data. The processing is necessary for the purposes of recruitment and on-boarding and for complying with legal obligations to which we are subject, and which may be subject to a relevant local recruitment privacy policy.
                    </Typography>
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, textAlign: 'justify' }}>
                    If you submit personal information for publication on our website, we will publish and otherwise use that information in accordance with the permission given to us.
                    Your privacy settings can be used to limit the publication of your information on our website and can be adjusted using privacy controls on the website.
                    We will not, without your express consent, supply your personal information to any third party for the purpose of their or any other third party’s direct marketing.
                </Typography>
                <Typography variant="h4" sx={{ mt: 2}}>
                    Sharing of Personal Data
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    We may share Personal Data with the following categories and recipients:
                </Typography>
                <Typography variant="body1" sx={{ ml: 2 }}>
                    <Typography sx={{ mt: 2 }}>
                        1.	Affiliates and Service Providers: If requested and/or approved by the client or prospective client, we will share personal data with our trusted affiliate companies and service providers in order to provide you with adequate services in relation to our business and those of our affiliates and service providers.
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        2.	Mandatory disclosures and Legal Claims: We share Personal Data in order to comply with the Company’s tax reporting obligations, comply with any subpoena, court order or other legal process, to comply with a request from regulators, governmental request or any other legally enforceable demand. We also share Personal Data to establish or protect our legal rights, property, or safety, or the rights, property, or safety of others, or to defend against legal claims.
                    </Typography>
                </Typography>
            </Container>
        </Box>
    )
}

export function getServerSideProps({ req }) {
    const userRole = req.cookies[process.env.userRole]
    const redirect = sessionRoutes(userRole, '/register')
    if (redirect) {
        return {
            redirect: {
                permanent: false,
                destination: redirect
            }
        }
    }

    return {
        props: {}
    }
}
