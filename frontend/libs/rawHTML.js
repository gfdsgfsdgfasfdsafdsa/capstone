const rawHTML = (text) => {
    return <span dangerouslySetInnerHTML={{ __html: text }}/>
}

export default rawHTML
