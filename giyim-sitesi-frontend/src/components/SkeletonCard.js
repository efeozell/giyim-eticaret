// src/components/SkeletonCard.js
import React from "react";
import "./SkeletonCard.css";

const SkeletonCard = () => {
	return (
		<div className="skeleton-card">
			<div className="skeleton-image"></div>
			<div className="skeleton-text-group">
				<div className="skeleton-text skeleton-category"></div>
				<div className="skeleton-text skeleton-title"></div>
				<div className="skeleton-text skeleton-price"></div>
			</div>
		</div>
	);
};

export default SkeletonCard;
