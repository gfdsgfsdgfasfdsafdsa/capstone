import {
    Box,
    Container
} from '@mui/material';
import ResultList from "../../result/ResultList";
import SearchBar from "../../../SearchBar";

const Home = ({ results,
                  onChangeSearch,
                  onKeyUpSearch,
                  searchText,
                  setSearchText,
                  pageIndex,
                  setPageIndex,
                  fromDate, setFromDate, toDate, setToDate, filter, setFilter,
}) => {
    return (
        <>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                }}
            >
                <Container maxWidth={false}>
                    <SearchBar
                        onChange={onChangeSearch}
                        onKeyUp={onKeyUpSearch}
                        text={searchText}
                        setText={setSearchText}
                        hasQuery={false}
                    />
                    <Box sx={{ mt: 1 }}>
                        <ResultList
                            pageIndex={pageIndex}
                            setPageIndex={setPageIndex}
                            results={results}
                            fromDate={fromDate}
                            setFromDate={setFromDate}
                            toDate={toDate}
                            setToDate={setToDate}
                            filter={filter}
                            setFilter={setFilter}
                        />
                    </Box>
                </Container>
            </Box>
        </>
    )
}

export default Home;

