// import React, { Suspense, useState } from 'react';
// import { JudgeMeReview } from './JudgeMeReview';
// import { YotpoReview } from './YotpoReview';

// export function ReviewCard({ reviewType, productId }) {
//   console.log('reviewType', reviewType)
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       {reviewType === 'JudgeMe' ? <JudgeMeReview /> : <YotpoReview productId={productId}/>}
//     </Suspense>
//   );
// }