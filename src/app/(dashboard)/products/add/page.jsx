// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import ProductAddHeader from '@views/products/add/ProductAddHeader'
import ProductInformation from '@views/products/add/ProductInformation'
import ProductImage from '@views/products/add/ProductImage'
import ProductVariants from '@views/products/add/ProductVariants'
import ProductInventory from '@views/products/add/ProductInventory'
import ProductPricing from '@views/products/add/ProductPricing'
import ProductOrganize from '@views/products/add/ProductOrganize'

const eCommerceProductsAdd = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ProductAddHeader />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <ProductInformation />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <ProductImage />
          </Grid>
          {/* <Grid size={{ xs: 12 }}>
            <ProductVariants />
          </Grid> */}
          {/* <Grid size={{ xs: 12 }}>
            <ProductInventory />
          </Grid> */}
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Grid container spacing={6}>
          {/* <Grid size={{ xs: 12 }}>
            <ProductPricing />
          </Grid> */}
          <Grid size={{ xs: 12 }}>
            <ProductOrganize />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default eCommerceProductsAdd
