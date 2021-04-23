import React from 'react';

const Card = ({Svgicon,Title}) => {
    return(
        <div className="card">
            <div className="svg-wrapper">
                <Svgicon/>
            </div>
            <div className="title">
                <h2>{Title}</h2>
            </div>
            <div className="text">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis officiis reiciendis numquam cum totam! Magnam laboriosam minima.</p>
            </div>
        </div>
    )
};

export default Card;