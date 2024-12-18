# Sorting Polyominoes

I want to be able to create a sort of periodic table of polyominoes, but this would require putting them in order. In order to put polyominoes in order, you need a set of properties of each polyomino that can be converted into a number, so that they may be sorted.
The periodic table of the elements sorts elements by proton count, which is different for each element. Polyominoes have an increasing number of cells, but there are multiple polyominoes of each cell count, so more specification is needed. In this document I intend to lay out a set of properties which will allow me to sort polyominoes in order. I would also like a method to freely orient any polyomino such that there is a standard orientation for the table.

## Orientation

I want to take any version of a free polyomino and be able to convert it into a single orientation with an algorithm. To do this, I need to establish properties to do this with.

### Bounding-Box Dimensions

The algorithm should rotate all polyominoes until the x component of the bounding box is less than or equal to the y component

## Properties

### Cell Count

Cell count is the most important property, and the highest priority. It is the number of cells a given polyomino has. Polyominoes will be sorted from fewest cells to most cells on the table.