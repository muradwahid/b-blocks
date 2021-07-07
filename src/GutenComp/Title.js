const Title = props => {
    const { mt, mb, children } = props;

    return <p className="bBlocksLabel" style={{ marginTop: `${mt ? mt : '20px'}`, marginBottom: `${mb ? mb : '5px'}` }}>{children}</p>;
};
export default Title;