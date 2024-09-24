type ReorderInstruction<T> = {
    elements: T[];
    newIndex: number;
};

export const reorderElements = <T>(array: T[], instruction: ReorderInstruction<T>): T[] => {
    // Create a copy of the array to avoid mutating the original array
    const result = array.slice();

    // Extract the elements to move
    const elementsToMove = instruction.elements;

    // Remove the elements from their original positions
    elementsToMove.forEach((element) => {
        const index = result.indexOf(element);
        if (index !== -1) {
            result.splice(index, 1);
        }
    });

    // Adjust newIndex if it's after the removal point
    let adjustedIndex = instruction.newIndex;

    // If moving elements down the list, adjust the new index to account for removed elements
    const originalIndices = elementsToMove
        .map((element) => array.indexOf(element))
        .sort((a, b) => a - b);

    const numElementsBeforeNewIndex = originalIndices.filter(
        (index) => index < instruction.newIndex,
    ).length;

    adjustedIndex -= numElementsBeforeNewIndex;

    // Insert the elements at their new position
    result.splice(adjustedIndex, 0, ...elementsToMove);

    return result;
};
