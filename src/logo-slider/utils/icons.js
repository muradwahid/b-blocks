const iconColor = '#4527a4';

export const blockIcon = <svg fill={iconColor} width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" > <path fillRule="evenodd" fill={iconColor} d="M15,2 C16.6568542,2 18,3.34314575 18,5 L18,19 C18,20.6568542 16.6568542,22 15,22 L9,22 C7.34314575,22 6,20.6568542 6,19 L6,5 C6,3.34314575 7.34314575,2 9,2 L15,2 Z M15,4 L9,4 C8.44771525,4 8,4.44771525 8,5 L8,19 C8,19.5522847 8.44771525,20 9,20 L15,20 C15.5522847,20 16,19.5522847 16,19 L16,5 C16,4.44771525 15.5522847,4 15,4 Z M3,6 C3.55228475,6 4,6.44771525 4,7 L4,17 C4,17.5522847 3.55228475,18 3,18 C2.44771525,18 2,17.5522847 2,17 L2,7 C2,6.44771525 2.44771525,6 3,6 Z M21,6 C21.5522847,6 22,6.44771525 22,7 L22,17 C22,17.5522847 21.5522847,18 21,18 C20.4477153,18 20,17.5522847 20,17 L20,7 C20,6.44771525 20.4477153,6 21,6 Z" /> </svg>

export const arrowLeft = <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" height="1em" width="1em"><path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z" /></svg>

export const arrowRight = <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"></path></svg>

export function BsPlus(props) {
    return <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 20 20" height="1em" width="1em" {...props}><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
}

export function FaTrash(props) {
    return <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 448 512" height="1em" width="1em" {...props}><path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z" /></svg>;
}